import { cloudinaryConfig } from "./cloudinary.config";

// ============================ uploadSingleFile ============================
export const uploadSingleFile = async ({
  fileLocation,
  storagePathOnCloudinary = "PriceTrackerApp",
}: {
  fileLocation: string;
  storagePathOnCloudinary: string;
}) => {
  const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
    fileLocation,
    {
      folder: `${process.env.APP_NAME}/${storagePathOnCloudinary}`,
    }
  );

  return { public_id, secure_url };
};

// ============================ uploadManyFiles ============================
export const uploadManyFiles = async ({
  fileLocationArr = [],
  storagePathOnCloudinary = "PriceTrackerApp",
}: {
  fileLocationArr: string[];
  storagePathOnCloudinary: string;
}) => {
  const images = [];
  for (const item of fileLocationArr) {
    const { public_id, secure_url } = await uploadSingleFile({
      fileLocation: item,
      storagePathOnCloudinary,
    });
    images.push({ public_id, secure_url });
  }
  return images;
};

// ============================ destroySingleFile ============================
export const destroySingleFile = async ({
  public_id,
}: {
  public_id: string;
}) => {
  await cloudinaryConfig().uploader.destroy(public_id);
};

// ============================ destroyManyFiles ============================
export const destroyManyFiles = async ({
  public_ids = [],
}: {
  public_ids: string[];
}) => {
  await cloudinaryConfig().api.delete_resources(public_ids);
};

// ============================ deleteByPrefix ============================
export const deleteByPrefix = async ({
  storagePathOnCloudinary,
}: {
  storagePathOnCloudinary: string;
}) => {
  await cloudinaryConfig().api.delete_resources_by_prefix(
    `${process.env.APP_NAME}/${storagePathOnCloudinary}`
  );
};

// ============================ deleteFolder ============================
export const deleteFolder = async ({
  storagePathOnCloudinary,
}: {
  storagePathOnCloudinary: string;
}) => {
  await cloudinaryConfig().api.delete_folder(
    `${process.env.APP_NAME}/${storagePathOnCloudinary}`
  );
};
