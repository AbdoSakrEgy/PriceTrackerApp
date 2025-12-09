"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.deleteByPrefix = exports.destroyManyFiles = exports.destroySingleFile = exports.uploadManyFiles = exports.uploadSingleFile = void 0;
// cloudinary.service.ts
const cloudinary_1 = __importDefault(require("cloudinary"));
let isCloudinaryInitialized = false;
const cloudinary = cloudinary_1.default.v2;
// Lazy initialization function
const initCloudinary = () => {
    if (isCloudinaryInitialized)
        return;
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
        secure: true,
    });
    isCloudinaryInitialized = true;
};
// ------------------------------------------------------------------
// SINGLE FILE UPLOAD
// ------------------------------------------------------------------
const uploadSingleFile = async ({ fileLocation, storagePathOnCloudinary = "ImaginoApp", }) => {
    initCloudinary();
    const { public_id, secure_url } = await cloudinary.uploader.upload(fileLocation, {
        folder: `${process.env.APP_NAME}/${storagePathOnCloudinary}`,
    });
    return { public_id, secure_url };
};
exports.uploadSingleFile = uploadSingleFile;
// ------------------------------------------------------------------
// MULTIPLE FILE UPLOAD
// ------------------------------------------------------------------
const uploadManyFiles = async ({ fileLocationArr = [], storagePathOnCloudinary = "ImaginoApp", }) => {
    initCloudinary();
    const images = [];
    for (const item of fileLocationArr) {
        const { public_id, secure_url } = await (0, exports.uploadSingleFile)({
            fileLocation: item,
            storagePathOnCloudinary,
        });
        images.push({ public_id, secure_url });
    }
    return images;
};
exports.uploadManyFiles = uploadManyFiles;
// ------------------------------------------------------------------
// DESTROY SINGLE FILE
// ------------------------------------------------------------------
const destroySingleFile = async ({ public_id }) => {
    initCloudinary();
    await cloudinary.uploader.destroy(public_id);
};
exports.destroySingleFile = destroySingleFile;
// ------------------------------------------------------------------
// DESTROY MULTIPLE FILES
// ------------------------------------------------------------------
const destroyManyFiles = async ({ public_ids = [] }) => {
    initCloudinary();
    await cloudinary.api.delete_resources(public_ids);
};
exports.destroyManyFiles = destroyManyFiles;
// ------------------------------------------------------------------
// DELETE BY PREFIX
// ------------------------------------------------------------------
const deleteByPrefix = async ({ storagePathOnCloudinary, }) => {
    initCloudinary();
    await cloudinary.api.delete_resources_by_prefix(`${process.env.APP_NAME}/${storagePathOnCloudinary}`);
};
exports.deleteByPrefix = deleteByPrefix;
// ------------------------------------------------------------------
// DELETE FOLDER
// ------------------------------------------------------------------
const deleteFolder = async ({ storagePathOnCloudinary, }) => {
    initCloudinary();
    await cloudinary.api.delete_folder(`${process.env.APP_NAME}/${storagePathOnCloudinary}`);
};
exports.deleteFolder = deleteFolder;
