import { Tuning, Mode, Key } from ".";


export interface IOptions {
  key: Key;
  tuning: Tuning;
  mode: Mode;
  numFrets: number;
  numStrings: number;
  markers: number[];
}

export interface IOption {
  Name: string;
}

export const defaultOptions: IOptions = {
  key: Key.C(),
  tuning: { Name: 'Standard', Offsets: [4, 9, 2, 7, 11, 4] } as Tuning,
  mode: Mode.Ionian(),
  numFrets: 12,
  numStrings: 6,
  markers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
};