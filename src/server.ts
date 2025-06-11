// import mongoose from "mongoose";
// import app from "./app";
// import { configs } from "./app/configs";



// async function main() {
//     await mongoose.connect(`mongodb+srv://${configs.db.user!}:${configs.db.password!}@cluster0.fp7vkua.mongodb.net/email-sender?retryWrites=true&w=majority&appName=Cluster0`);
//     app.listen(configs.port, () => {
//         console.log(`Example app listening on port ${configs.port}`)
//     })

// }
// main().catch(err => console.log(err));


import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import app from "./app";
import { configs } from "./app/configs";

// HTTP এবং IO setup
const server = createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
});


app.set("io", io);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
});

async function main() {
    await mongoose.connect(`mongodb+srv://${configs.db.user!}:${configs.db.password!}@cluster0.fp7vkua.mongodb.net/email-sender?retryWrites=true&w=majority&appName=Cluster0`);
    server.listen(configs.port, () => {
        console.log(`Server listening on port ${configs.port}`);
    });
}
main().catch(err => console.log(err));
