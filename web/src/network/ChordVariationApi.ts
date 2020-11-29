import { Chord, ChordModifier, ChordVariation, Note, Tuning } from "../models";
import { ApiRequest } from "./ApiRequest";

export interface ChordVariationGenerateParams {
  chordId?: string;
  chord?: Partial<Chord>;
  tuningId?: string;
  tuning?: Partial<Tuning>;
  offset?: number;
  span?: number;
}

export interface ChordVariationGenerateRangeParams extends ChordVariationGenerateParams {
  range?: number;
}

enum ChordVariationAction {
  Generate = 'Generate',
  GenerateRange = 'GenerateRange',
}

export class ChordVariationApi extends ApiRequest<ChordVariation> {

  constructor() {
    super('ChordVariation');
  }

  private hack = (chord: Partial<Chord>): Chord => {
    return {
      Root: {
        Base: chord.Root.Base,
        Suffix: chord.Root.Suffix,
      },
      Modifier: chord.Modifier
    } as Chord;
  }

  Generate(params: ChordVariationGenerateParams): Promise<ChordVariation[]> {
    return super.Post(params, ChordVariationAction.Generate) as Promise<ChordVariation[]>;
  }

  GenerateRange(params: ChordVariationGenerateRangeParams): Promise<ChordVariation[]> {

    // TODO: Figure out what is goin on here. Cheap fix for now
    if (params.chord) params.chord = this.hack(params.chord);

    return super.Post(params, ChordVariationAction.GenerateRange) as Promise<ChordVariation[]>;
  }

}