"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
require("dotenv/config");
exports.configs = {
    port: process.env.PORT,
    env: "development",
    jwt: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,
        access_expires: process.env.ACCESS_EXPIRES,
        refresh_expires: process.env.REFRESH_EXPIRES,
        reset_secret: process.env.RESET_SECRET,
        reset_expires: process.env.RESET_EXPIRES,
        reset_base_link: process.env.RESET_BASE_LINK
    },
    aws: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID,
        access_secret_key: process.env.AWS_ACCESS_KEY_SECRET
    },
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
};
