import { AppError } from "../../utils/app_error";
import { TAccount, TLoginPayload, TRegisterPayload } from "./auth.interface";
import { Account_Model } from "./auth.schema";
import httpStatus from 'http-status';
import bcrypt from "bcrypt";
import { TUser } from "../user/user.interface";
import { User_Model } from "../user/user.schema";
import mongoose from "mongoose";
import { jwtHelpers } from "../../utils/JWT";
import { configs } from "../../configs";
import { JwtPayload, Secret } from "jsonwebtoken";
import mail_sender from "../../utils/mail_sender"
// register user
const register_user_into_db = async (payload: TRegisterPayload) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check if the account already exists
        const isExistAccount = await Account_Model.findOne(
            { email: payload?.email },
            null,
            { session }
        );
        if (isExistAccount) {
            throw new AppError("Account already exist!!", httpStatus.BAD_REQUEST);
        }

        // Hash the password
        const hashPassword = bcrypt.hashSync(payload?.password, 10);

        // Create account
        const accountPayload: TAccount = {
            email: payload.email,
            password: hashPassword,
            lastPasswordChange: new Date()
        };
        const newAccount = await Account_Model.create([accountPayload], { session });

        // Create user
        const userPayload: TUser = {
            name: payload.name,
            accountId: newAccount[0]._id,
        };
        await User_Model.create([userPayload], { session });

        // Commit the transaction
        await session.commitTransaction();
        await mail_sender(payload.email, "Thanks for creating account!", `Hello ${payload.name}`, `
            <h3>Hi, ${payload.name}</h3>
            <p>Thanks for creating account. We hope you get a super fast services and powerful support from us. Don't be panic stay with us. </p>`)
        return newAccount;
    } catch (error) {
        // Rollback the transaction
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


// login user
const login_user_from_db = async (payload: TLoginPayload) => {
    // check account info 
    const isExistAccount = await Account_Model.findOne({ email: payload.email })
    // check account
    if (!isExistAccount) {
        throw new AppError("Account not found!!", httpStatus.NOT_FOUND)
    }
    if (isExistAccount.isDeleted) {
        throw new AppError("Account deleted !!", httpStatus.BAD_REQUEST)
    }
    if (isExistAccount.status == "BLOCK") {
        throw new AppError("Account is blocked !!", httpStatus.BAD_REQUEST)
    }

    const isPasswordMatch = await bcrypt.compare(
        payload.password,
        isExistAccount.password,
    );

    if (!isPasswordMatch) {
        throw new AppError('Invalid password', httpStatus.UNAUTHORIZED);
    }

    const accessToken = jwtHelpers.generateToken(
        {
            email: isExistAccount.email,
            role: isExistAccount.role,
        },
        configs.jwt.access_token as Secret,
        configs.jwt.access_expires as string,
    );

    const refreshToken = jwtHelpers.generateToken(
        {
            email: isExistAccount.email,
            role: isExistAccount.role,
        },
        configs.jwt.refresh_token as Secret,
        configs.jwt.refresh_expires as string,
    );
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: isExistAccount.role
    };

}

const get_my_profile_from_db = async (email: string) => {
    const isExistAccount = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })
    if (!isExistAccount) {
        throw new AppError("Account not found! Go support for need any help!", httpStatus.NOT_FOUND)
    }
    const accountProfile = await User_Model.findOne({ accountId: isExistAccount._id })
    isExistAccount.password = ""
    return {
        account: isExistAccount,
        profile: accountProfile
    };
};

const refresh_token_from_db = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(
            token,
            configs.jwt.refresh_token as Secret,
        );
    } catch (err) {
        throw new Error('You are not authorized!');
    }

    const userData = await Account_Model.findOne({ email: decodedData.email, status: "ACTIVE", isDeleted: false })

    const accessToken = jwtHelpers.generateToken(
        {
            email: userData!.email,
            role: userData!.role,
        },
        configs.jwt.access_token as Secret,
        configs.jwt.access_expires as string,
    );

    return accessToken;
};

const change_password_from_db = async (
    user: JwtPayload,
    payload: {
        oldPassword: string;
        newPassword: string;
    },
) => {
    const isExistAccount = await Account_Model.findOne({ email: user.email, status: "ACTIVE", isDeleted: false })
    if (!isExistAccount) {
        throw new AppError('Account not found !', httpStatus.NOT_FOUND);
    }

    const isCorrectPassword: boolean = await bcrypt.compare(
        payload.oldPassword,
        isExistAccount.password,
    );

    if (!isCorrectPassword) {
        throw new AppError('Old password is incorrect', httpStatus.UNAUTHORIZED);
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);
    await Account_Model.findOneAndUpdate({ email: isExistAccount.email }, {
        password: hashedPassword,
        lastPasswordChange: Date()
    })
    await mail_sender(
        isExistAccount.email,
        'Your Password Changed !!',
        "",
        `<div style="font-family: Arial, sans-serif;">
      <h4>Password Change Notification</h4>
      <p>Your password was changed on <strong>${new Date().toLocaleDateString()}</strong>.</p>
      <p>If this wasn't you, please 
        <a href="" style="color: #1a73e8;">reset your password</a> immediately.
      </p>
    </div>`,
    );

    return 'Password changed successful.';
};

const forget_password_from_db = async (email: string) => {
    const isAccountExists = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })

    if (!isAccountExists) {
        throw new AppError('Account not found', 404);
    }

    const resetToken = jwtHelpers.generateToken(
        {
            email: isAccountExists.email,
            role: isAccountExists.role,
        },
        configs.jwt.reset_secret as Secret,
        configs.jwt.reset_expires as string,
    );

    const resetPasswordLink = `${configs.jwt.reset_base_link}?token=${resetToken}&email=${isAccountExists.email}`;
    const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;

    await mail_sender(email, 'Reset Password Link', "", emailTemplate);

    return 'Check your email for reset link';
};

const reset_password_into_db = async (
    token: string,
    email: string,
    newPassword: string,
) => {
    let decodedData: JwtPayload;
    try {
        decodedData = jwtHelpers.verifyToken(
            token,
            configs.jwt.reset_secret as Secret,
        );
    } catch (err) {
        throw new AppError(
            'Your reset link is expire. Submit new link request!!',
            httpStatus.UNAUTHORIZED,
        );
    }

    const isAccountExists = await Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false })
    if (!isAccountExists) {
        throw new AppError('Account not found!!', httpStatus.NOT_FOUND);
    }
    if (isAccountExists.email !== email) {
        throw new AppError('Invalid email', httpStatus.UNAUTHORIZED);
    }

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);

    await Account_Model.findOneAndUpdate({ email: isAccountExists.email }, {
        password: hashedPassword,
        lastPasswordChange: Date()
    })
    await mail_sender(
        isAccountExists.email,
        'Password Reset Successful.',
        "",
        `<p>Your password is successfully reset now you can login with using your password</p>`,
    );
    return 'Password reset successfully!';
};


export const auth_services = {
    register_user_into_db,
    login_user_from_db,
    get_my_profile_from_db,
    refresh_token_from_db,
    change_password_from_db,
    forget_password_from_db,
    reset_password_into_db
}