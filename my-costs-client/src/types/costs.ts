interface ICost {
  text: string;
  price: number;
  date: Date | string;
  _id?: number | string;
}

interface IDeleteCost {
  id: number | string;
}

interface ICreateCost {
  cost: ICost;
}

interface IUpdateCost {
  cost: ICost;
}

interface ICostsListProps {
  costs: ICost[];
}

interface ICostItemProps {
  cost: ICost;
  index: number;
}

export type {
  ICost,
  IDeleteCost,
  ICreateCost,
  IUpdateCost,
  ICostsListProps,
  ICostItemProps,
};
