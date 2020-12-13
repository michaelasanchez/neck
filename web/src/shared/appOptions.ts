import { Chord, ChordModifier, ChordVariation, Instrument, Key, Mode, Note, Tuning } from "../models";
import { ApiEntity } from "../network";

export interface AppOptions {
  chord: Chord;
  instrument: Instrument;
  tuning: Tuning;

  key: Key; 
  mode: Mode; // Options modal 

  chordVariation?: ChordVariation;
  variations?: ChordVariation[];

  // Validation
  [key: string]: any
}

export interface IOption {
  Label: string;
}

//  C           D           E     F           G           A           B   
//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
//  B#                      Fb    E#                                  Cb
//  0     1     2     3     4     5     6     7     8     9     10    11 
