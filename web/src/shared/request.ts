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

export class BaseRequest {

  protected _url: string;
  protected _type: RequestType;

  protected _data: {};

  protected _baseOptions: BaseRequestOptions;

  protected constructor(url?: string, type: RequestType = RequestType.Get, options: BaseRequestOptions = DefaultBaseRequestOptions) {
    if (url) this._url = url;

    this._type = type;
    this._baseOptions = options;
  }

  protected execute() {
    const convert = this._baseOptions.convertToJson;

    // THIS DOESNT WORK
    const init = this._data ? {
      method: this._type,
      body: JSON.stringify(this._data),
      headers: { 'Content-type': 'application/json' }
    } : null;

    return fetch(this._url)
      .then(response => convert ? response.json() : response)
      .then(response => {
        console.log('base response', response);
      })
      .catch(reason => {
        const message = reason?.message || 'Failed to fetch'
        console.log('base error', reason);
        console.log('base message', message);
      });
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