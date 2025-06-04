import mongoose from "mongoose";
import app from "./app";
import { configs } from "./app/configs";



async function main() {
    // await mongoose.connect('mongodb://localhost:27017/email-sender');
    app.listen(configs.port, () => {
        console.log(`Example app listening on port ${configs.port}`)
    })

}
main().catch(err => console.log(err));