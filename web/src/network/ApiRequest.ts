import { ApiEntity } from "./ApiEntity";
import { BaseRequest } from "./BaseRequest";

// const DOMAIN_DEFAULT = 'https://localhost:5001';
const DOMAIN_DEFAULT = 'https://neck-api.azurewebsites.net';

// Allowed types
export type EntityType = 'chord' | 'chordvariation' | 'instrument' | 'scale' | 'scalevariation' | 'tuning';

export enum ApiAction { }

export class ApiRequest<TResult = ApiEntity> extends BaseRequest<TResult> {

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

  private get Domain(): string { return this._domain };
  private set Domain(value: string) {
    this._domain = value;
    this.Url = this.calcUrl();
  }

  get EntityType(): EntityType { return this._entityType; }
  set EntityType(value: EntityType) {
    this._entityType = value;
    this.Url = this.calcUrl();
  }

  get Action(): string { return this._action; }
  set Action(value: string) {
    this._action = value;
    this.Url = this.calcUrl();
  };

  protected calcUrl(): string {
    return `${this.Domain}/${this.EntityType}${this.Action ? '/' : ''}${this.Action}`;
  }

  GetAll = (): Promise<TResult[]> => {
    this.Action = 'all';
    return super.Get() as Promise<TResult[]>;
  }

  GetById = (id: string): Promise<TResult> => {
    this.Action = id;
    return super.Get() as Promise<TResult>;
  }

  Create = (data: {}): Promise<TResult> => {
    return super.Post(data) as Promise<TResult>;
  }

  // TODO: This one breaks an endpoint on load
  //    when converted to an arrow function???
  Post(data?: {}, action?: string): Promise<TResult | TResult[]> {

    if (action) {
      this.Action = action;
    }

    return super.Post(data);
  }
}