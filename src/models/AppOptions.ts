import { Instrument, Key, Mode, Tuning } from ".";
import { FretDisplayMode } from "../components/neck";

export interface IAppOptions {
  instrument: Instrument;
  key: Key;
  tuning: Tuning;
  mode: Mode;
  numFrets: number;
  markers: number[];
  fretMode: FretDisplayMode;
}

export interface IOption {
  Label: string;
}

// const basicOptions: Partial<IAppOptions> = {
//   key: Key.C(),
//   mode: Mode.Ionian(),
//   numFrets: 12,
//   fretMode: FretDisplayMode.Note,
// }

// export const ukeOptions: IAppOptions = {
//   ...basicOptions as IAppOptions,
//   instrument: Instrument.Ukulele,
//   tuning: { Label: 'Ukulele', Offsets: [7, 0, 4, 9] } as Tuning, // ukulele
//   markers: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 2], // ukulele
// }

// export const guitarOptions: IAppOptions = {
//   ...basicOptions as IAppOptions,
//   instrument: Instrument.Guitar,
//   tuning: { Label: 'Standard', Offsets: [4, 9, 2, 7, 11, 4] } as Tuning,
//   markers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
// }

// //  C           D           E     F           G           A           B   
// //        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
// //  B#                      Fb    E#                                  Cb
// //  0     1     2     3     4     5     6     7     8     9     10    11 

// export const defaultOptions = guitarOptions;