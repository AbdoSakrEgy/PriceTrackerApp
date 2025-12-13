"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioServices = void 0;
const socketio_server_1 = require("./socketio.server");
const chat_validation_1 = require("../../modules/chat/chat.validation");
const app_error_1 = require("../../core/errors/app.error");
const http_status_code_1 = require("../../core/http/http.status.code");
const user_model_1 = require("../../modules/user/user.model");
class SocketioServices {
    constructor() { }
    // ========================== sayHi ==========================
    sayHi = (socket) => {
        socket.on("sayHi", async (arg, callback) => {
            try {
                // console.log("hi");
                callback("done");
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== isUserTyping ==========================
    isUserTyping = (socket) => {
        socket.on("isUserTyping", async (arg, callback) => {
            try {
                const { sendTo, isTyping } = arg;
                socket.to(sendTo).emit("is_user_typing", isTyping);
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== isUserOnline ==========================
    isUserOnline = (socket) => {
        socket.on("isUserOnline", async (arg, callback) => {
            try {
                const { sendTo, isOnline } = arg;
                socket.to(sendTo).emit("is_user_online", isOnline);
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== sendMessage ==========================
    sendMessage = (socket) => {
        socket.on("sendMessage", async (arg, callback) => {
            try {
                const { sendTo, content } = chat_validation_1.chatMessageSchema.parse(arg);
                const createdBy = socket.user?._id;
                const to = await user_model_1.UserModel.findOne({
                    filter: { _id: sendTo },
                });
                if (!to) {
                    throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "User not found");
                }
                const chat = await ChatModel.findOne({
                    filter: {
                        participants: { $all: [to._id, createdBy] },
                        group: { $exists: false },
                    },
                });
                if (!chat) {
                    throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "Chat not found");
                }
                await chat.updateOne({
                    $push: { messages: { content: content, createdBy } },
                });
                socket.emit("successMessage", content);
                socket
                    .to(socketio_server_1.connectedSockets.get(to._id.toString()) || [])
                    .emit("newMessage", {
                    content,
                    from: socket.user,
                });
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
    // ========================== joinRoom ==========================
    joinRoom = (socket) => {
        socket.on("join_room", async (arg, callback) => {
            try {
                const { groupId } = arg;
                const group = await ChatModel.findOne({
                    filter: {
                        _id: groupId,
                        participants: { $in: [socket.user?._id] },
                        groupName: { $exists: true },
                    },
                });
                if (!group) {
                    throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "Group not found");
                }
                socket.join(groupId);
            }
            catch (err) {
                socket.emit("custom_err", err);
            }
        });
    };
    // ========================== sendGroupMessage ==========================
    sendGroupMessage = (socket) => {
        socket.on("sendGroupMessage", async (arg, callback) => {
            try {
                const { content, groupId } = chat_validation_1.chatGroupMessageSchema.parse(arg);
                const createdBy = socket.user?._id;
                const group = await ChatModel.findOne({
                    filter: {
                        _id: groupId,
                        participants: { $in: [socket.user?._id] },
                        groupName: { $exists: true },
                    },
                });
                if (!group) {
                    throw new app_error_1.AppError(http_status_code_1.HttpStatusCode.NOT_FOUND, "Group not found");
                }
                await group.updateOne({
                    $push: { messages: { content, createdBy } },
                });
                socket.emit("successMessage", content);
                socket
                    .to(groupId)
                    .emit("newMessage", { content, from: socket.user, groupId });
            }
            catch (err) {
                socket.emit("custom_error", err);
            }
        });
    };
}
exports.SocketioServices = SocketioServices;
