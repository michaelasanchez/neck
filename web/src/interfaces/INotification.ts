export enum NotificationType {
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Error = 'danger',
  Warning = 'warning',
  Info = 'info',
  Light = 'light',
  Dark = 'dark',
}

export interface INotification {
  message: string;
  type: NotificationType;
}

export interface IActiveNotification extends INotification {
  id: number;
  init: Date;
  expiring: boolean;
  postponed: boolean;
  dismissed?: boolean;
}