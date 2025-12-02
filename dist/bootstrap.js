"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
const Errors_1 = require("./utils/Errors");
const cors_1 = __importDefault(require("cors"));
const db_connection_1 = require("./DB/db.connection");
dotenv_1.default.config({
    path: path_1.default.resolve("./src/config/.env"),
});
const app = (0, express_1.default)();
// Middleware
var whitelist = [
    "http://example1.com",
    "http://example2.com",
    "http://127.0.0.1:5501",
    undefined,
];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Errors_1.ApplicationException("Not allowed by CORS", 401));
        }
    },
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/api/v1", routes_1.default);
// Global error handler
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        errMsg: err.message,
        status: err.statusCode || 500,
        stack: err.stack,
    });
});
// Wrap server start in an async function
const startServer = async () => {
    try {
        await (0, db_connection_1.connectDB)(); // ✅ wait for DB connection
        console.log("DB connected, starting server...");
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    }
    catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1); // Stop server if DB fails
    }
};
startServer();
exports.default = app;
