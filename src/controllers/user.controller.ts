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


// Enable 2fa





