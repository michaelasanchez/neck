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

    // TODO: Not really sure if anything other than post needs a body
    const options = type != RequestType.Get ? {
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

  Get(): Promise<TResult | TResult[]> {
    return this.execute(RequestType.Get);
  }

  Post(data?: {}): Promise<TResult | TResult[]> {
    return this.execute(RequestType.Post, data);
  }

  // TODO: Not sure if this works
  Delete(data?: {}): Promise<TResult> {
    return this.execute(RequestType.Delete, data);
  }

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