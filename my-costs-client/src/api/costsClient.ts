import { createEffect } from "effector";
import { AxiosError } from "axios";
import { handleAlertMessage, removeUser } from "../utils/auth";
import { createCost, setCosts, updateCost } from "../context";
import { ICreateCost, IDeleteCost } from "../types";
import { IHandleErrorPaylaod } from "../types/error";
import api from "./axiosClient";

const createCostFX = createEffect(async ({ cost }: ICreateCost) => {
  try {
    const { data } = await api.post("/costs", { ...cost });
    return data;
  } catch (error) {
    handleAxiosError(error as AxiosError, {
      type: "create",
      createCost: { cost },
    });
  }
});

const updateCostFX = createEffect(async ({ cost }: ICreateCost) => {
  try {
    const { data } = await api.patch(`/costs/${cost._id}`, { ...cost });
    return data;
  } catch (error) {
    handleAxiosError(error as AxiosError, {
      type: "update",
      updateCost: { cost },
    });
  }
});

const getCostFX = createEffect(async () => {
  try {
    const result = await api.get("/costs");
    return result.data;
  } catch (error) {
    handleAxiosError(error as AxiosError, { type: "get" });
  }
});

const deleteCostFX = createEffect(async ({ id }: IDeleteCost) => {
  try {
    await api.delete(`/costs/${id}`);
  } catch (error) {
    handleAxiosError(error as AxiosError, {
      type: "delete",
      deleteCost: { id },
    });
  }
});

const handleAxiosError = async (
  error: AxiosError,
  payload: IHandleErrorPaylaod | null = null
) => {
  const errorMessage =
    (
      error.response?.data as {
        message: string;
      }
    ).message ||
    (
      error.response?.data as {
        error: string;
      }
    ).error;

  const statusCode = (error.response?.data as { statusCode: number })
    .statusCode;

  if (errorMessage) {
    if (statusCode === 401) {
      const payloadData = payload as IHandleErrorPaylaod;
      await refereshTokenFx();

      if (payload) {
        switch (payloadData.type) {
          case "get":
            const costs = await getCostFX();
            setCosts(costs);
            break;
          case "create":
            const createdCost = await createCostFX({
              cost: { ...payloadData.createCost!.cost },
            });

            if (!createdCost) {
              return;
            }

            createCost(createdCost);
            handleAlertMessage({
              text: "success create cost",
              type: "success",
            });
            break;
          case "update":
            const updatedCost = await updateCostFX({
              cost: { ...payloadData.updateCost!.cost },
            });

            if (!updatedCost) {
              return;
            }

            updateCost(updatedCost);
            handleAlertMessage({
              text: "success update cost",
              type: "success",
            });
            break;
          case "delete":
            await deleteCostFX({ id: payload.deleteCost!.id as string });
            break;
          default:
            break;
        }
      }
    } else {
      handleAlertMessage({ text: errorMessage, type: "warning" });
      removeUser();
    }
  }
};

const refereshTokenFx = createEffect(async () => {
  try {
    const username = JSON.parse(
      localStorage.getItem("auth") as string
    ).username;
    const result = await api.post("/auth/refresh", { username: username });

    if ((result.status = 200)) {
      localStorage.setItem("auth", JSON.stringify(result.data));
    } else {
      removeUser();
    }
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
});

export {
  handleAxiosError,
  createCostFX,
  getCostFX,
  refereshTokenFx,
  deleteCostFX,
  updateCostFX,
};
