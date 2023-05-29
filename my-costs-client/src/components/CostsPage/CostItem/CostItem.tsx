import { FC, useState, Fragment } from "react";
import { formatDate } from "../../../utils/costs";
import { deleteCostFX, updateCostFX } from "../../../api/costsClient";
import { deleteCost, updateCost } from "../../../context";
import { handleAlertMessage } from "../../../utils/auth";
import { ICostItemProps } from "../../../types";
import Spinner from "../../Spinner/Spinner";
import "./styles.css";

const CostItem: FC<ICostItemProps> = (props: ICostItemProps) => {
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [updateSpinner, setUpdateSpinner] = useState(false);
  const [edit, setEdit] = useState(false);

  const [text, setText] = useState(props.cost.text);
  const [price, setPrice] = useState<number>(props.cost.price);
  const [date, setDate] = useState(props.cost.date);

  const handleDeleteCost = async () => {
    setDeleteSpinner(true);
    await deleteCostFX({
      id: props.cost._id as string,
    });
    setDeleteSpinner(false);
    deleteCost(props.cost._id as string);
    handleAlertMessage({ text: "success remove", type: "success" });
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) =>
    setText(event.target.value);
  const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPrice(Number(event.target.value));
  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(event.target.value);

  const handleEditCost = async () => {
    setUpdateSpinner(true);

    if (
      text === props.cost.text &&
      price === props.cost.price &&
      date === props.cost.date
    ) {
      setUpdateSpinner(false);
      setEdit(false);
      return;
    }

    const editedCost = await updateCostFX({
      cost: {
        text: text,
        price: price,
        date: date,
        _id: props.cost._id,
      },
    });

    if (!editedCost) {
      setUpdateSpinner(false);
      setEdit(false);
      return;
    }

    setEdit(false);
    setUpdateSpinner(false);
    updateCost(editedCost);
    handleAlertMessage({ text: "success update cost", type: "success" });
  };

  const cancelEditCost = () => {
    setUpdateSpinner(false);
    setEdit(false);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between cost-item"
      id={props.cost._id as string}
    >
      {edit ? (
        <Fragment>
          <div className="d-flex align-items-center gap-3 cost-item-input-container">
            <input
              type="text"
              className="form-control"
              value={text}
              onChange={handleChangeText}
            />
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={handleChangePrice}
            />
            <input
              type="date"
              className="form-control"
              value={new Date(date).toISOString().split("T")[0]}
              onChange={handleChangeDate}
            />
          </div>
          <div className="d-flex align-items-center gap-3 cost-item-btn-container">
            <button className="btn btn-success" onClick={handleEditCost}>
              {updateSpinner ? <Spinner /> : "Save"}
            </button>
            <button className="btn btn-danger" onClick={cancelEditCost}>
              Exit
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className="d-flex align-items-center gap-2">
            <span>{props.index}: </span>
            <span>{props.cost.text} - </span>
            <span>{formatDate(props.cost.date as string)} - </span>
            <span>{props.cost.price}</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-primary" onClick={() => setEdit(!edit)}>
              Change cost
            </button>
            <button className="btn btn-danger" onClick={handleDeleteCost}>
              {deleteSpinner ? (
                <Spinner />
              ) : (
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default CostItem;
