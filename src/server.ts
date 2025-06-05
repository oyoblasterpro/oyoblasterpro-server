import mongoose from "mongoose";
import app from "./app";
import { configs } from "./app/configs";



async function main() {
    await mongoose.connect(`mongodb+srv://${configs.db.user!}:${configs.db.password!}@cluster0.fp7vkua.mongodb.net/email-sender?retryWrites=true&w=majority&appName=Cluster0`);
    app.listen(configs.port, () => {
        console.log(`Example app listening on port ${configs.port}`)
    })

}
main().catch(err => console.log(err));