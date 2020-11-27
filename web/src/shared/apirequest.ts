import { Chord, ChordModifier, Note, Tuning } from "../models";
import { BaseRequest } from "./request";

const DOMAIN_DEFAULT = 'https://localhost:5001';

export type EntityType = 'ChordVariation' | 'Tuning';

export enum Api {
  ChordVariation,
  Tuning
}

export type EntityTypeTestTest = Api.ChordVariation | Api.Tuning;

export class ApiRequest extends BaseRequest {

  private _domain: string;

  private _entityType: EntityType;
  private _action: string;

  constructor(entityType: EntityType, action: string = '') {
    super(`${DOMAIN_DEFAULT}/${entityType}${action.length ? '/' : ''}${action}`);

    this._entityType = entityType;
    this._action = action;
  }

  Generate(): Promise<void> {
    return super.Post({ chord: new Chord(Note.C(), ChordModifier.Major), tuning: Tuning.Standard() });
  }

  // public async GetAsync() {
  //   return await super.executeAsync();
  // }
}