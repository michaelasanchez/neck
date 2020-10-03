
import { Tuning } from "./Tuning";

export enum ChordFormType {
  MajorForm1,
  MajorForm2,
  MinorForm1,
  MinorForm2,
  Dominant7Form1,
  Dominant7Form2,
  Minor7Form1,
  Minor7Form2
}

export const mapTypeToPositions = (type: ChordFormType): number[] => {
  switch (type) {
    case ChordFormType.MajorForm1:
      return [0, 2, 2, 1, 0, 0];
    case ChordFormType.MajorForm2:
      return [null, 0, 2, 2, 2, 0];
    case ChordFormType.MinorForm1:
      return [0, 2, 2, 0, 0, 0];
    case ChordFormType.MinorForm2:
      return [null, 0, 2, 2, 1, 0];
  }
}

export class ChordForm {

  private _tuning: Tuning;

  private _offsets: number[];
  private _positions: number[];
  private _degrees: number[];

  constructor(tuning: Tuning, position: number[]) {
    this._tuning = tuning;
    this._offsets = tuning.Offsets;
  }

  public static All() {
    return [
      ChordFormType.MajorForm1,
      ChordFormType.MajorForm2,
      ChordFormType.MinorForm1,
      ChordFormType.MinorForm2,
    ];
  }
}