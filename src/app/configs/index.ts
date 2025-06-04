import "dotenv/config";

export const configs = {
    port: process.env.PORT,
    jwt: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN,

    },
    aws: {
        access_key_id: process.env.AWS_ACCESS_KEY_ID,
        access_secret_key: process.env.AWS_ACCESS_KEY_SECRET
    }
}