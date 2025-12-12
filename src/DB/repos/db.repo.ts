import { DeleteOptions } from "mongodb";
import {
  HydratedDocument,
  Model,
  FilterQuery,
  ProjectionFields,
  QueryOptions,
  FlattenMaps,
  UpdateQuery,
  RootFilterQuery,
  MongooseBaseQueryOptions,
} from "mongoose";

export class DBRepo<T> {
  constructor(protected model: Model<T>) {}

  // ============================ findOne ============================
  findOne = async ({
    filter,
    projection,
    options,
  }: {
    filter: FilterQuery<T>;
    projection?: ProjectionFields<T>;
    options?: QueryOptions;
  }): Promise<
    HydratedDocument<T> | null | FlattenMaps<HydratedDocument<T>>
  > => {
    const doc = this.model.findOne(filter, projection, options);
    if (options?.lean) doc.lean(true);
    return await doc.exec();
  };

  // ============================ find ============================
  find = async ({
    filter,
    projection,
    options,
  }: {
    filter: FilterQuery<T>;
    projection?: ProjectionFields<T>;
    options?: QueryOptions;
  }): Promise<
    HydratedDocument<T>[] | null | FlattenMaps<HydratedDocument<T>[]> | []
  > => {
    const doc = this.model.find(filter, projection, options);
    if (options?.lean) doc.lean(true);
    return await doc.exec();
  };
  // ============================ create ============================
  create = async ({
    data,
  }: {
    data: Partial<T>;
  }): Promise<HydratedDocument<T>> => {
    const doc = await this.model.create(data);
    return doc;
  };

  // ============================ findOneAndUpdate ============================
  findOneAndUpdate = async ({
    filter,
    data,
    options = { new: true },
  }: {
    filter: FilterQuery<T>;
    data: UpdateQuery<T>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<T> | null> => {
    const doc = this.model.findOneAndUpdate(filter, data, options);
    if (options?.lean) doc.lean(true);
    return await doc.exec();
  };

  // ============================ findOneAndDelete ============================
  findOneAndDelete = async ({
    filter,
    options,
  }: {
    filter: FilterQuery<T>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<T> | null> => {
    const doc = this.model.findOneAndDelete(filter, options);
    if (options?.lean) doc.lean(true);
    return await doc.exec();
  };

  // ============================ deleteMany ============================
  deleteMany = async ({
    filter,
    options,
  }: {
    filter: RootFilterQuery<T>;
    options?: DeleteOptions & MongooseBaseQueryOptions<T>;
  }): Promise<any> => {
    return await this.model.deleteMany(filter, options).exec();
  };
}
