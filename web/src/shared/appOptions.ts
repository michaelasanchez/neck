import { FretDisplayMode } from "../components/neck";
import { Instrument, Key, Mode, Tuning } from "../models";

export interface IAppOptions {
  instrument: Instrument;
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
      numFrets: 13,
      fretMode: FretDisplayMode.Note
    }
  }

  static GuitarOptions(): IAppOptions {
    return {
      ...this._baseOptions() as IAppOptions,
      instrument: Instrument.Guitar,
      tuning: { Label: 'Standard', Offsets: [4, 9, 2, 7, 11, 4] } as Tuning,
      markers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
    }
  }

  static UkuleleOptions(): IAppOptions {
    return {
      ...this._baseOptions() as IAppOptions,
      instrument: Instrument.Ukulele,
      tuning: { Label: 'Ukulele', Offsets: [7, 0, 4, 9] } as Tuning, // ukulele
      markers: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2], // ukulele
    }
  }

  static Default(): IAppOptions {
    return this.GuitarOptions();
  }
}