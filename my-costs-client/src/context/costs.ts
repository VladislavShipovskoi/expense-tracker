import { createDomain } from "effector";
import { ICost } from "../types";

const costsDomain = createDomain();

const setCosts = costsDomain.createEvent<ICost[]>();
const createCost = costsDomain.createEvent<ICost>();
const updateCost = costsDomain.createEvent<ICost>();
const deleteCost = costsDomain.createEvent<string | number>();
const setTotalCosts = costsDomain.createEvent<number>();

const handleDeleteCost = (costs: ICost[], id: string | number) =>
  costs.filter((cost) => cost._id !== id);

const handleUpdateCost = (
  costs: ICost[],
  id: string | number,
  payload: Partial<ICost>
) =>
  costs.map((cost) => {
    if (cost._id === id) {
      return {
        ...cost,
        ...payload,
      };
    }

    return cost;
  });

const $totalCosts = costsDomain
  .createStore<number>(0)
  .on(setTotalCosts, (state, newValue) => newValue);

const $costs = costsDomain
  .createStore<ICost[]>([])
  .on(setCosts, (state, costs) => costs)
  .on(createCost, (state, newCost) => [...state, newCost])
  .on(deleteCost, (state, id) => [...handleDeleteCost(state, id)])
  .on(updateCost, (state, cost) => [
    ...handleUpdateCost(state, cost._id as string, {
      text: cost.text,
      price: cost.price,
      date: cost.date,
    }),
  ]);

export {
  $totalCosts,
  setTotalCosts,
  $costs,
  setCosts,
  createCost,
  deleteCost,
  updateCost,
};
