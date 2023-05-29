import { FC } from "react";
import CostItem from "../CostItem/CostItem";
import { ICostsListProps } from "../../../types";
import "./styles.css";

const CostsList: FC<ICostsListProps> = (props: ICostsListProps) => {
  return (
    <div className="costs-list-container">
      {props.costs.map((cost, index) => {
        return <CostItem key={cost._id} cost={cost} index={index} />;
      })}
    </div>
  );
};

export default CostsList;
