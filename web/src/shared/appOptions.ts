import { FretDisplayMode } from "../components/neck";
import { Chord, ChordModifier, Instrument, Key, Mode, Note, Tuning } from "../models";

export interface IAppOptions {
  chord: Chord;
  instrument: Instrument;
  instrumentId: string;
  key: Key;
  tuning: Tuning;
  tuningId: string;
  mode: Mode;
  numFrets: number;
  markers: number[];
  fretMode: FretDisplayMode;
}

export interface IOption {
  Label: string;
}

//  C           D           E     F           G           A           B   
//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
//  B#                      Fb    E#                                  Cb
//  0     1     2     3     4     5     6     7     8     9     10    11 

export class AppOptions {

  private static _baseOptions(): Partial<IAppOptions> {
    return {
      key: Key.C(),
      mode: Mode.Ionian(),
      chord: new Chord(Note.C(), ChordModifier.Major),
      numFrets: 14,
      fretMode: FretDisplayMode.Note
    }
  }

  static GuitarOptions(): IAppOptions {
    return {
      ...this._baseOptions() as IAppOptions,
      markers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0],
    }
  }

  static UkuleleOptions(): IAppOptions {
    return {
      ...this._baseOptions() as IAppOptions,
      markers: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2], // ukulele
    }
  }

  static Default(): IAppOptions {
    return this.GuitarOptions();
  }
}