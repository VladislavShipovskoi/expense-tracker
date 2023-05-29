import { ICost, IDeleteCost, IUpdateCost } from "./costs";

interface IHandleErrorPaylaod {
  type: string;
  createCost?: { cost: ICost };
  getCost?: {};
  deleteCost?: IDeleteCost;
  updateCost?: IUpdateCost;
}

export type { IHandleErrorPaylaod };
