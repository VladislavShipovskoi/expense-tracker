import { setTotalCosts } from "../context/costs";
import { ICost } from "../types";

const countTotalPrice = (costs: ICost[]) => {
  if (!costs) return;
  setTotalCosts(costs.reduce((prev, current) => prev + current.price, 0));
};

const formatDate = (date: string) => {
  const newDate = new Date(date);

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  return newDate.toLocaleString("en", options as Intl.DateTimeFormatOptions);
};

export { countTotalPrice, formatDate };
