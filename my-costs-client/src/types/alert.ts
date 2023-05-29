interface IAlert {
  text: string;
  type: string;
}

interface IAlertProps extends IAlert {}

export type { IAlert, IAlertProps };
