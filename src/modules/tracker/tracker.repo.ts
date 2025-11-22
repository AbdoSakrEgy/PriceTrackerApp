import {
  HydratedDocument,
  Model,
  ProjectionFields,
  QueryOptions,
} from "mongoose";
import { DBRepo } from "../../DB/repos/db.repo";
import { ITracker, TrackerModel } from "./tracker.model";

export class TrackerRepo extends DBRepo<ITracker> {
  constructor(
    protected override readonly model: Model<ITracker> = TrackerModel
  ) {
    super(model);
  }

  findByTitle = async ({
    title,
    projection,
    options,
  }: {
    title: string;
    projection?: ProjectionFields<ITracker>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<ITracker>[] | null> => {
    const doc = await this.model.find({ title }, projection, options);
    return doc;
  };
}
