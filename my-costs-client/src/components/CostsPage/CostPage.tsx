import { FC, MutableRefObject, useEffect, useRef, useState, memo } from "react";
import { useStore } from "effector-react";
import Spinner from "../Spinner/Spinner";
import { $costs, $totalCosts, createCost, setCosts } from "../../context";
import { createCostFX, getCostFX } from "../../api/costsClient";
import { countTotalPrice } from "../../utils/costs";
import { handleAlertMessage } from "../../utils/auth";
import CostsList from "./CostsList/CostList";
import "./styles.css";

const CostsPage: FC = () => {
  const [spinner, setSpinner] = useState(false);

  const costs = useStore($costs);
  const totalCosts = useStore($totalCosts);

  const textRef = useRef() as MutableRefObject<HTMLInputElement>;
  const priceRef = useRef() as MutableRefObject<HTMLInputElement>;
  const dateRef = useRef() as MutableRefObject<HTMLInputElement>;

  const MemoizedCostsList = memo(() => <CostsList costs={costs} />);

  useEffect(() => {
    handleGetCosts();
  }, []);

  useEffect(() => {
    countTotalPrice(costs);
  }, [costs]);

  const handleGetCosts = async () => {
    setSpinner(true);
    const costs = await getCostFX();
    setSpinner(false);
    setCosts(costs);
  };

  const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSpinner(true);

    const textValue = textRef.current.value;
    const priceValue = priceRef.current.value;
    const dateValue = dateRef.current.value;

    const cost = await createCostFX({
      cost: {
        text: textValue,
        price: parseInt(priceValue),
        date: dateValue,
      },
    });

    if (!cost) {
      setSpinner(false);
      return;
    }

    setSpinner(false);
    createCost(cost);
    handleAlertMessage({
      text: "success create cost",
      type: "success",
    });
  };

  return (
    <div className="container  mt-5">
      <form className="d-flex gap-3" onSubmit={formSubmit}>
        <div className="form-item">
          <span className="mb-2">Where</span>
          <input
            type="text"
            className="form-control"
            ref={textRef}
            required
          ></input>
        </div>

        <div className="form-item">
          <span className="mb-2">How much</span>
          <input
            type="number"
            min="0.00"
            step="0.01"
            className="form-control"
            ref={priceRef}
            required
          ></input>
        </div>

        <div className="form-item">
          <span className="mb-2">When</span>
          <input
            type="date"
            className="form-control"
            ref={dateRef}
            required
          ></input>
        </div>

        <div className="form-item form-item-btn-container">
          <button className="btn btn-primary">
            {spinner ? <Spinner /> : "Add cost"}
          </button>
        </div>
      </form>
      <div className="mt-3">
        Total:
        <span>{isNaN(totalCosts) ? 0 : parseInt(String(totalCosts))}</span>
      </div>
      <MemoizedCostsList />
    </div>
  );
};

export default CostsPage;
