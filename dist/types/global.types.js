"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileType = exports.StoreInEnum = exports.PricingPlanEnum = exports.RoleEnum = exports.GenderEnum = void 0;
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "male";
    GenderEnum["FEMALE"] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["ADMIN"] = "admin";
    RoleEnum["USER"] = "user";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var PricingPlanEnum;
(function (PricingPlanEnum) {
    PricingPlanEnum["FREE"] = "free";
    PricingPlanEnum["BASIC"] = "basic";
    PricingPlanEnum["PRO"] = "pro";
})(PricingPlanEnum || (exports.PricingPlanEnum = PricingPlanEnum = {}));
var StoreInEnum;
(function (StoreInEnum) {
    StoreInEnum["DISK"] = "disk";
    StoreInEnum["MEMORY"] = "memory";
})(StoreInEnum || (exports.StoreInEnum = StoreInEnum = {}));
exports.FileType = {
    image: ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"],
    video: ["video/mp4", "video/webm"],
};
