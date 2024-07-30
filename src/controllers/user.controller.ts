import { Request, Response } from "express";
import User, {IUser} from "../models/user.model";
import { hashData, verifyHashedData } from "../utils/hashPassword";
import * as crypto from 'crypto';
import { encode } from "hi-base32";
import OTPAuth from "otpauth";
 import QRCode from "qrcode";



export const createUser = async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);

        // Validate the user input
        if (!user.userEmail || !user.userPassword) {
            return res.status(400).json({ status: false, message: "Please provide an email and password" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ userEmail: user.userEmail }).exec();
        if (existingUser) {
            return res.status(400).json({ status: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword : any = await hashData(user.userPassword);

        // Save the hashed password instead of the plain text password
        user.userPassword = hashedPassword;

        await user.save();
        res.status(201).json({status: true, user: user});
    } catch (error: any) {
        res.status(500).json({ status: false, message: error.message });
    }
};

export const LoginUser = async (req: Request, res: Response) => {
    try {
        const { userEmail, userPassword } = req.body;
        const user = await User.findOne({ userEmail }).exec();

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Verify the hashed password
        const match = await verifyHashedData(userPassword, user.userPassword);

        if (!match) {
            return res.status(400).json({ status: false, message: "Invalid password" });
        }

        res.status(200).json({ status: true, user });
    }
    catch (error: any) {   
        res.status(500).json({ status: false, message: error.message });
    }
}

// Generate BASE32 secret key
const generateBase32Secret = () => {
    const buffer = crypto.randomBytes(15);
    return encode(buffer).replace(/=/g, "").substring(0, 24);
}


//Enable 2FA
export const enable2FA = async (req: Request, res: Response) => {
    const userId = req.body.userId || req.params.userId || req.query.userId;

    if(!await User.findOne({_id: userId})) {
        return res.status(404).json({ status: "false", message: "User does not exist"})
    }
    // Generate secret key for the user
    const base32_secret: string = generateBase32Secret();

    // Store secret key in User object
    await User.updateOne({_id: userId}, {secrets2fa: base32_secret});

    //Generate TOTP auth url
    let totp = new OTPAuth.TOTP({
        issuer: "2FA Server",
        label: "user.userEmail",
        algorithm: "SHA1",
        digits: 6,
        secret: base32_secret
    });
    const otpauth_url: string = totp.toString();

    QRCode.toDataURL(otpauth_url, (error: Error | null | undefined, qrUrl: string) => {
        if(error) {
            console.log(error);
            return res.status(500).json({ status: 'false', message: "Error while generating QR Code"})
        }
        res.status(200).json({ status: true, qrCodeUrl: qrUrl, secret: base32_secret });
    })
}

// Validate 2FA
export const verify2FA = async (req: Request, res: Response) => {
    const { userId, token } = req.body;
    const user = await User.findOne({_id: userId});
    if(!user) {
        return res.status(404).json({status: "false", message: "User does not exist" })
    }
    // verify the token
    const totp = new OTPAuth.TOTP({
        issuer: "codeninjainsights.com",
        label: "codeninjainsights",
        algorithm: "SHA1",
        digits: 6,
        secret: user.secrets2fa!
    });
    const isValid = totp.validate({token});

    if(isValid === null) {
        return res.status(401).json({ status: "false", message: "Invalid token"})
    }
    // update the  user status
    if(!user.enable2fa) {
        await User.updateOne({_id: userId}, {enable2fa: true});
    }

        res.status(200).json({ status: true, message: "Token is valid" });
}