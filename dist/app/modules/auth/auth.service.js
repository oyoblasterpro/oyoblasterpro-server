"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth_services = void 0;
const app_error_1 = require("../../utils/app_error");
const auth_schema_1 = require("./auth.schema");
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = require("../user/user.schema");
const mongoose_1 = __importDefault(require("mongoose"));
const JWT_1 = require("../../utils/JWT");
const configs_1 = require("../../configs");
const mail_sender_1 = __importDefault(require("../../utils/mail_sender"));
// register user
const register_user_into_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Check if the account already exists
        const isExistAccount = yield auth_schema_1.Account_Model.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email }, null, { session });
        if (isExistAccount) {
            throw new app_error_1.AppError("Account already exist!!", http_status_1.default.BAD_REQUEST);
        }
        // Hash the password
        const hashPassword = bcrypt_1.default.hashSync(payload === null || payload === void 0 ? void 0 : payload.password, 10);
        // Create account
        const accountPayload = {
            email: payload.email,
            password: hashPassword,
            lastPasswordChange: new Date()
        };
        const newAccount = yield auth_schema_1.Account_Model.create([accountPayload], { session });
        // Create user
        const userPayload = {
            name: payload.name,
            accountId: newAccount[0]._id,
        };
        yield user_schema_1.User_Model.create([userPayload], { session });
        // Commit the transaction
        yield session.commitTransaction();
        yield (0, mail_sender_1.default)(payload.email, "Thanks for creating account!", `Hello ${payload.name}`, `
            <h3>Hi, ${payload.name}</h3>
            <p>Thanks for creating account. We hope you get a super fast services and powerful support from us. Don't be panic stay with us. </p>`);
        return newAccount;
    }
    catch (error) {
        // Rollback the transaction
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// login user
const login_user_from_db = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check account info 
    const isExistAccount = yield auth_schema_1.Account_Model.findOne({ email: payload.email });
    // check account
    if (!isExistAccount) {
        throw new app_error_1.AppError("Account not found!!", http_status_1.default.NOT_FOUND);
    }
    if (isExistAccount.isDeleted) {
        throw new app_error_1.AppError("Account deleted !!", http_status_1.default.BAD_REQUEST);
    }
    if (isExistAccount.status == "BLOCK") {
        throw new app_error_1.AppError("Account is blocked !!", http_status_1.default.BAD_REQUEST);
    }
    const isPasswordMatch = yield bcrypt_1.default.compare(payload.password, isExistAccount.password);
    if (!isPasswordMatch) {
        throw new app_error_1.AppError('Invalid password', http_status_1.default.UNAUTHORIZED);
    }
    const accessToken = JWT_1.jwtHelpers.generateToken({
        email: isExistAccount.email,
        role: isExistAccount.role,
    }, configs_1.configs.jwt.access_token, configs_1.configs.jwt.access_expires);
    const refreshToken = JWT_1.jwtHelpers.generateToken({
        email: isExistAccount.email,
        role: isExistAccount.role,
    }, configs_1.configs.jwt.refresh_token, configs_1.configs.jwt.refresh_expires);
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: isExistAccount.role
    };
});
const get_my_profile_from_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAccount = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isExistAccount) {
        throw new app_error_1.AppError("Account not found! Go support for need any help!", http_status_1.default.NOT_FOUND);
    }
    const accountProfile = yield user_schema_1.User_Model.findOne({ accountId: isExistAccount._id });
    isExistAccount.password = "";
    return {
        account: isExistAccount,
        profile: accountProfile
    };
});
const refresh_token_from_db = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = JWT_1.jwtHelpers.verifyToken(token, configs_1.configs.jwt.refresh_token);
    }
    catch (err) {
        throw new Error('You are not authorized!');
    }
    const userData = yield auth_schema_1.Account_Model.findOne({ email: decodedData.email, status: "ACTIVE", isDeleted: false });
    const accessToken = JWT_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
    }, configs_1.configs.jwt.access_token, configs_1.configs.jwt.access_expires);
    return accessToken;
});
const change_password_from_db = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExistAccount = yield auth_schema_1.Account_Model.findOne({ email: user.email, status: "ACTIVE", isDeleted: false });
    if (!isExistAccount) {
        throw new app_error_1.AppError('Account not found !', http_status_1.default.NOT_FOUND);
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, isExistAccount.password);
    if (!isCorrectPassword) {
        throw new app_error_1.AppError('Old password is incorrect', http_status_1.default.UNAUTHORIZED);
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 10);
    yield auth_schema_1.Account_Model.findOneAndUpdate({ email: isExistAccount.email }, {
        password: hashedPassword,
        lastPasswordChange: Date()
    });
    yield (0, mail_sender_1.default)(isExistAccount.email, 'Your Password Changed !!', "", `<div style="font-family: Arial, sans-serif;">
      <h4>Password Change Notification</h4>
      <p>Your password was changed on <strong>${new Date().toLocaleDateString()}</strong>.</p>
      <p>If this wasn't you, please 
        <a href="" style="color: #1a73e8;">reset your password</a> immediately.
      </p>
    </div>`);
    return 'Password changed successful.';
});
const forget_password_from_db = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isAccountExists = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isAccountExists) {
        throw new app_error_1.AppError('Account not found', 404);
    }
    const resetToken = JWT_1.jwtHelpers.generateToken({
        email: isAccountExists.email,
        role: isAccountExists.role,
    }, configs_1.configs.jwt.reset_secret, configs_1.configs.jwt.reset_expires);
    const resetPasswordLink = `${configs_1.configs.jwt.reset_base_link}?token=${resetToken}&email=${isAccountExists.email}`;
    const emailTemplate = `<p>Click the link below to reset your password:</p><a href="${resetPasswordLink}">Reset Password</a>`;
    yield (0, mail_sender_1.default)(email, 'Reset Password Link', "", emailTemplate);
    return 'Check your email for reset link';
});
const reset_password_into_db = (token, email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = JWT_1.jwtHelpers.verifyToken(token, configs_1.configs.jwt.reset_secret);
    }
    catch (err) {
        throw new app_error_1.AppError('Your reset link is expire. Submit new link request!!', http_status_1.default.UNAUTHORIZED);
    }
    const isAccountExists = yield auth_schema_1.Account_Model.findOne({ email, status: "ACTIVE", isDeleted: false });
    if (!isAccountExists) {
        throw new app_error_1.AppError('Account not found!!', http_status_1.default.NOT_FOUND);
    }
    if (isAccountExists.email !== email) {
        throw new app_error_1.AppError('Invalid email', http_status_1.default.UNAUTHORIZED);
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    yield auth_schema_1.Account_Model.findOneAndUpdate({ email: isAccountExists.email }, {
        password: hashedPassword,
        lastPasswordChange: Date()
    });
    yield (0, mail_sender_1.default)(isAccountExists.email, 'Password Reset Successful.', "", `<p>Your password is successfully reset now you can login with using your password</p>`);
    return 'Password reset successfully!';
});
exports.auth_services = {
    register_user_into_db,
    login_user_from_db,
    get_my_profile_from_db,
    refresh_token_from_db,
    change_password_from_db,
    forget_password_from_db,
    reset_password_into_db
};
