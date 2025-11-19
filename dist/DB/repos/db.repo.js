"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBRepo = void 0;
class DBRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    // ============================ findOne ============================
    findOne = async ({ filter, projection, options, }) => {
        const doc = this.model.findOne(filter, projection, options);
        if (options?.lean)
            doc.lean(true);
        return await doc.exec();
    };
    // ============================ find ============================
    find = async ({ filter, projection, options, }) => {
        const doc = this.model.find(filter, projection, options);
        if (options?.lean)
            doc.lean(true);
        return await doc.exec();
    };
    // ============================ create ============================
    create = async ({ data, }) => {
        const doc = await this.model.create(data);
        return doc;
    };
    // ============================ findOneAndUpdate ============================
    findOneAndUpdate = async ({ filter, data, options = { new: true }, }) => {
        const doc = this.model.findOneAndUpdate(filter, data, options);
        if (options?.lean)
            doc.lean(true);
        return await doc.exec();
    };
    // ============================ findOneAndDelete ============================
    findOneAndDelete = async ({ filter, options, }) => {
        const doc = this.model.findOneAndDelete(filter, options);
        if (options?.lean)
            doc.lean(true);
        return await doc.exec();
    };
    // ============================ deleteMany ============================
    deleteMany = async ({ filter, options, }) => {
        return await this.model.deleteMany(filter, options).exec();
    };
}
exports.DBRepo = DBRepo;
