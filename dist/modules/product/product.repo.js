"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepo = void 0;
const db_repo_1 = require("../../DB/repos/db.repo");
const product_model_1 = require("./product.model");
class ProductRepo extends db_repo_1.DBRepo {
    model;
    constructor(model = product_model_1.ProductModel) {
        super(model);
        this.model = model;
    }
    findByTitle = async ({ title, projection, options, }) => {
        const doc = await this.model.find({ title }, projection, options);
        return doc;
    };
}
exports.ProductRepo = ProductRepo;
