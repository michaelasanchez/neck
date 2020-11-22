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

  protected constructor(url?: string, options: BaseRequestOptions = DefaultBaseRequestOptions) {
    if (url) this._url = url;

    this._baseOptions = options;
  }

  private execute() {
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

  get Type(): RequestType {
    return this._type;
  }

  set Type(value: RequestType) {
    this._type = value;
  }

  get Data(): {} {
    return this._data;
  }
  
  set Data(value: {}) {
    if (isNull(this._data) || !isNull(value)) {
      this._data = value;
    }
  }

  Get(): Promise<void> {
    this.Type = RequestType.Get;
    return this.execute()
  }

  Post(data?: {}): Promise<void> {
    this.Type = RequestType.Post;
    this.Data = data;
    return this.execute();
  }

  Delete(data?: {}): Promise<void> {
    this.Type = RequestType.Delete;
    this.Data = data;
    return this.execute();
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