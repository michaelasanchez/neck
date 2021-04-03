import { ApiEntity } from './ApiEntity';
import { BaseRequest, BaseResponse } from './BaseRequest';

const DOMAIN_DEFAULT = 'https://neck-api.azurewebsites.net';

// Allowed types
export type EntityType =
  | 'chord'
  | 'chordvariation'
  | 'instrument'
  | 'scale'
  | 'scalevariation'
  | 'tuning';

export enum ApiAction {}

export class ApiRequest<T = ApiEntity> extends BaseRequest<T> {
  protected _domain: string;

  protected _entityType: EntityType;
  protected _action: string;

  constructor(entityType: EntityType, action: string = '') {
    super();

    this._domain = DOMAIN_DEFAULT;
    this._entityType = entityType;
    this._action = action;

    this.Url = this.calcUrl();
  }

  private get Domain(): string {
    return this._domain;
  }
  private set Domain(value: string) {
    this._domain = value;
    this.Url = this.calcUrl();
  }

  get EntityType(): EntityType {
    return this._entityType;
  }
  set EntityType(value: EntityType) {
    this._entityType = value;
    this.Url = this.calcUrl();
  }

  get Action(): string {
    return this._action;
  }
  set Action(value: string) {
    this._action = value;
    this.Url = this.calcUrl();
  }

  protected calcUrl(): string {
    return `${this.Domain}/${this.EntityType}${this.Action ? '/' : ''}${
      this.Action
    }`;
  }

  GetAll = (): Promise<Array<T>> => {
    this.Action = 'all';
    return super.Get() as Promise<Array<T>>;
  };

  GetById = (id: string): Promise<T> => {
    this.Action = id;
    return super.Get() as Promise<T>;
  };

  GetAllAsync = (): Promise<BaseResponse<Array<T>>> => {
    this.Action = 'all';
    return super.GetAsync() as Promise<BaseResponse<Array<T>>>;
  };

  CreateAsync = (data: T): Promise<BaseResponse<T>> => {
    return super.PostAsync(data) as Promise<BaseResponse<T>>;
  };

  // TODO: This one breaks an endpoint on load
  //    when converted to an arrow function???
  // Post(data?: {}, action?: string): Promise<T | Array<T>> {
  //   if (action) {
  //     this.Action = action;
  //   }
  //   return super.Post(data);
  // }

  PostAsync(data?: {}, action?: string): Promise<BaseResponse<any>> {
    if (action) {
      this.Action = action;
    }
    return super.PostAsync(data);
  }
}
