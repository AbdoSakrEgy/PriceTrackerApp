"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.deleteByPrefix = exports.destroyManyFiles = exports.destroySingleFile = exports.uploadManyFiles = exports.uploadSingleFile = void 0;
const cloudinary_config_1 = require("./cloudinary.config");
// ============================ uploadSingleFile ============================
const uploadSingleFile = async ({ fileLocation, storagePathOnCloudinary = "PriceTrackerApp", }) => {
    const { public_id, secure_url } = await (0, cloudinary_config_1.cloudinaryConfig)().uploader.upload(fileLocation, {
        folder: `${process.env.APP_NAME}/${storagePathOnCloudinary}`,
    });
    return { public_id, secure_url };
};
exports.uploadSingleFile = uploadSingleFile;
// ============================ uploadManyFiles ============================
const uploadManyFiles = async ({ fileLocationArr = [], storagePathOnCloudinary = "PriceTrackerApp", }) => {
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
// ============================ destroySingleFile ============================
const destroySingleFile = async ({ public_id, }) => {
    await (0, cloudinary_config_1.cloudinaryConfig)().uploader.destroy(public_id);
};
exports.destroySingleFile = destroySingleFile;
// ============================ destroyManyFiles ============================
const destroyManyFiles = async ({ public_ids = [], }) => {
    await (0, cloudinary_config_1.cloudinaryConfig)().api.delete_resources(public_ids);
};
exports.destroyManyFiles = destroyManyFiles;
// ============================ deleteByPrefix ============================
const deleteByPrefix = async ({ storagePathOnCloudinary, }) => {
    await (0, cloudinary_config_1.cloudinaryConfig)().api.delete_resources_by_prefix(`${process.env.APP_NAME}/${storagePathOnCloudinary}`);
};
exports.deleteByPrefix = deleteByPrefix;
// ============================ deleteFolder ============================
const deleteFolder = async ({ storagePathOnCloudinary, }) => {
    await (0, cloudinary_config_1.cloudinaryConfig)().api.delete_folder(`${process.env.APP_NAME}/${storagePathOnCloudinary}`);
};
exports.deleteFolder = deleteFolder;
