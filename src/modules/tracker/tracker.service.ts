import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../utils/successHandler";
import { TrackerRepo } from "./tracker.repo";
import { ProductRepo } from "../product/product.repo";

interface ITrackerServices {
  createTracker(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response>;
}

export class TrackerServices implements ITrackerServices {
  private trackerRepo = new TrackerRepo();
  private productRepo = new ProductRepo();

  constructor() {}
  // ============================ createTracker ============================
  createTracker = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return successHandler({ res });
  };

  // ============================ checkPrices ============================
  checkPrices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    return successHandler({ res });
  };
}
