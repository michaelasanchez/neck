import { Chord, ChordModifier, ChordVariation, Note, Tuning } from "../models";
import { BaseRequest } from "./request";

export enum ApiType {
  ChordVariation
}

export class ApiRequest extends BaseRequest {
  
  constructor(entityType: 'ChordVariation') {
    super(entityType);

  }

  Get(): Promise<void> {
    return super.execute({ chord: new Chord(Note.C(), ChordModifier.Major), tuning: Tuning.Standard() });
  }

  // public async GetAsync() {
  //   return await super.executeAsync();
  // }
}