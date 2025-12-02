// TypeScript version
export const createOtp = async () => {
  const { customAlphabet } = await import("nanoid");
  const otp = customAlphabet("0123456", 6)();
  return otp;
};
