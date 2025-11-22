import {
  HydratedDocument,
  Model,
  ProjectionFields,
  QueryOptions,
} from "mongoose";
import { DBRepo } from "../../DB/repos/db.repo";
import { IProduct, ProductModel } from "./product.model";

export class ProductRepo extends DBRepo<IProduct> {
  constructor(
    protected override readonly model: Model<IProduct> = ProductModel
  ) {
    super(model);
  }

  findByTitle = async ({
    title,
    projection,
    options,
  }: {
    title: string;
    projection?: ProjectionFields<IProduct>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<IProduct>[] | null> => {
    const doc = await this.model.find({ title }, projection, options);
    return doc;
  };
}
