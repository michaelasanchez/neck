import { isNull } from "lodash";

export interface BaseRequestOptions {
  convertToJson: boolean;
}

export const DefaultBaseRequestOptions = {
  convertToJson: true,
}

enum RequestType {
  Get = 'GET',
  Post = 'POST',
  Patch = 'PATCH',
  Delete = 'DELETE'
}

export interface BaseResponse<TResult> {
  success: boolean;
  result?: TResult;
  message?: string;
  code?: number;
}

export class BaseRequest<TResult> {

  protected _url: string;

  protected _data: {};

  protected _baseOptions: BaseRequestOptions;

  protected constructor(url?: string, options: BaseRequestOptions = DefaultBaseRequestOptions) {
    if (url) this._url = url;

    this._baseOptions = options;
  }

  get Url(): string { return this._url; }
  set Url(value: string) { this._url = value; }

  get Data(): {} { return this._data; }
  set Data(value: {}) {
    if (isNull(this._data) || !isNull(value)) {
      this._data = value;
    }
  }

  private execute(type: RequestType, data?: {}) {
    let convert = this._baseOptions.convertToJson;

    const options = type === RequestType.Post || type === RequestType.Patch ? {
      method: type,
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json' }
    } : null;

    return fetch(this._url, options)
      .then((response: Response) => {
        if (!response.ok) {
          convert = false;
          throw new Error(`Request failed: ${response.url}`)
        }
        return response;
      })
      .then(response => convert ? response.json() : response)
      .then(response => {
        return response;
      })
      .catch(reason => {
        const message = reason?.message || 'Failed to fetch'
        console.error(message);
      });
  }

  private executeAsync = async (type: RequestType, data?: {}) => {

    const options = type === RequestType.Post || type === RequestType.Patch ? {
      method: type,
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json' }
    } : null;

    const response = await fetch(this._url, options);

    const { message, ...result } = await response.json();

    const soclose = {
      success: response.ok,
      code: response.status,
      message,
      result,
    } as BaseResponse<TResult>;

    console.log(soclose);
    
    // return soclose;

    if (response.ok) {
      return result;
    } else {
      throw new Error(message ?? 'Hope this isn\'t production!');
    }
  }

  Get(): Promise<TResult | TResult[]> {
    return this.execute(RequestType.Get);
  }

  Post(data?: {}): Promise<TResult | TResult[]> {
    return this.execute(RequestType.Post, data);
  }

  PostAsync(data?: {}) {
    return this.executeAsync(RequestType.Post, data);
  }

  Patch(data?: {}): Promise<TResult> {
    return this.execute(RequestType.Patch, data);
  }

  // Delete(data?: {}): Promise<TResult> {
  //   return this.execute(RequestType.Delete, data);
  // }

  // protected async executeAsync() {
  //   const convert = this._baseOptions.convertToJson;
  //   return await fetch(this._url)
  //     .then(response => convert ? response.json() : response)
  //     .then(response => {
  //       console.log('base response', response);
  //     })
  //     .catch(reason => {
  //       const message = reason?.message || 'Failed to fetch'
  //       console.log('base error', reason);
  //       console.log('base message', message);
  //     });
  // }
}