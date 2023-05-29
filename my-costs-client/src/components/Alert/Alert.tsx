import { FC } from "react";
import { IAlertProps } from "../../types";
import "./styles.css";

const Alert: FC<IAlertProps> = (props: IAlertProps) => (
  <div className={`alert alert-wrapper alert-${props.type}`}>{props.text}</div>
);

export default Alert;
