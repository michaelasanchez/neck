import { Chord, ChordModifier, ChordVariation, Note, Tuning } from "../models";
import { BaseRequest } from "./request";

const DOMAIN_DEFAULT = 'https://localhost:5001';

export enum ApiType {
  ChordVariation
}

export class ApiRequest extends BaseRequest {

  private _domain: string;

  private _entity: string;
  private _action: string;
  
  constructor(entityType: 'ChordVariation', action: string = '') {
    super(`${DOMAIN_DEFAULT}/${entityType}${action.length && '/'}${action}`);
  }

  Generate(): Promise<void> {
    return super.Post({ chord: new Chord(Note.C(), ChordModifier.Major), tuning: Tuning.Standard() });
  }

  // public async GetAsync() {
  //   return await super.executeAsync();
  // }
}