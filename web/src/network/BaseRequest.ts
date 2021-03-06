import { isArray, isNull } from 'lodash';

export interface BaseRequestOptions {
  convertToJson: boolean;
}

export const DefaultBaseRequestOptions = {
  convertToJson: true,
};

enum RequestType {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

export interface BaseResponse<TResult> {
  success: boolean;
  result?: TResult;
  message?: string;
  code?: number;
}

export class BaseRequest<T> {
  protected _url: string;

  protected _data: {};

  protected _baseOptions: BaseRequestOptions;

  protected constructor(
    url?: string,
    options: BaseRequestOptions = DefaultBaseRequestOptions
  ) {
    if (url) this._url = url;

    this._baseOptions = options;
  }

  get Url(): string {
    return this._url;
  }
  set Url(value: string) {
    this._url = value;
  }

  get Data(): {} {
    return this._data;
  }
  set Data(value: {}) {
    if (isNull(this._data) || !isNull(value)) {
      this._data = value;
    }
  }

  private execute(type: RequestType, data?: {}) {
    let convert = this._baseOptions.convertToJson;

    const options =
      type === RequestType.Post || type === RequestType.Patch
        ? {
            method: type,
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json' },
          }
        : null;

    return fetch(this._url, options)
      .then((response: Response) => {
        if (!response.ok) {
          convert = false;
          throw new Error(`Request failed: ${response.url}`);
        }
        return response;
      })
      .then((response) => (convert ? response.json() : response))
      .then((response) => {
        return response;
      })
      .catch((reason) => {
        const message = reason?.message || 'Failed to fetch';
        console.error(message);
      });
  }

  private executeAsync = async (
    type: RequestType,
    data?: {}
  ): Promise<BaseResponse<T>> => {
    const options =
      type === RequestType.Post || type === RequestType.Patch
        ? {
            method: type,
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json' },
          }
        : null;

    const response = await fetch(this._url, options);

    const json = await response.json();
    const { message, ...rest } = json;

    // TODO: arrays are converted to objects without this
    let result: any;
    if (isArray(json)) {
      result = json;
    } else {
      result = rest;
    }

    const baseResponse = {
      success: response.ok,
      code: response.status,
      message,
      result,
    } as BaseResponse<T>;

    // TODO: decide
    return Promise.resolve(baseResponse);
    // return response.ok
    //   ? Promise.resolve(baseResponse)
    //   : Promise.reject(baseResponse);
  };

  Get(): Promise<T | Array<T>> {
    return this.execute(RequestType.Get);
  }

  GetAsync(): Promise<BaseResponse<T | Array<T>>> {
    return this.executeAsync(RequestType.Get);
  }

  Post(data?: {}): Promise<T | Array<T>> {
    return this.execute(RequestType.Post, data);
  }

  PostAsync(data?: {}): Promise<BaseResponse<T | Array<T>>> {
    return this.executeAsync(RequestType.Post, data);
  }

  PatchAsync(data?: {}): Promise<BaseResponse<T>> {
    return this.executeAsync(RequestType.Patch, data);
  }
}
