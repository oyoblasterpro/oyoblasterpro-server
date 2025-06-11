"use strict";
// import mongoose from "mongoose";
// import app from "./app";
// import { configs } from "./app/configs";
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
// async function main() {
//     await mongoose.connect(`mongodb+srv://${configs.db.user!}:${configs.db.password!}@cluster0.fp7vkua.mongodb.net/email-sender?retryWrites=true&w=majority&appName=Cluster0`);
//     app.listen(configs.port, () => {
//         console.log(`Example app listening on port ${configs.port}`)
//     })
// }
// main().catch(err => console.log(err));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const configs_1 = require("./app/configs");
// HTTP এবং IO setup
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
    }
});
app_1.default.set("io", io);
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(`mongodb+srv://${configs_1.configs.db.user}:${configs_1.configs.db.password}@cluster0.fp7vkua.mongodb.net/email-sender?retryWrites=true&w=majority&appName=Cluster0`);
        server.listen(configs_1.configs.port, () => {
            console.log(`Server listening on port ${configs_1.configs.port}`);
        });
    });
}
main().catch(err => console.log(err));
