import { Model, Schema, model } from "mongoose";

export interface IUser {
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    userPassword: string;
    enable2fa?: boolean;
    secrets2fa?: string;
}

const userSchema = new Schema<IUser>(
    {
        userFirstName: {
            type: String,
            trim: true,
        },
        userLastName: {
            type: String,
            trim: true,
        },
        userEmail: {
            type: String,
            trim: true,
        },
        userPassword: {
            type: String,
            trim: true,
        },
        enable2fa: {
            type: Boolean,
            default: false,
        },
        secrets2fa: {
            type: String,
        },
        
    }
);

const User = model<IUser>("User", userSchema);
export default User;