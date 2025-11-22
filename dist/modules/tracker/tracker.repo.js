"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerRepo = void 0;
const db_repo_1 = require("../../DB/repos/db.repo");
const tracker_model_1 = require("./tracker.model");
class TrackerRepo extends db_repo_1.DBRepo {
    model;
    constructor(model = tracker_model_1.TrackerModel) {
        super(model);
        this.model = model;
    }
    findByTitle = async ({ title, projection, options, }) => {
        const doc = await this.model.find({ title }, projection, options);
        return doc;
    };
}
exports.TrackerRepo = TrackerRepo;
