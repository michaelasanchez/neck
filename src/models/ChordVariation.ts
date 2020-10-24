import { each, min } from "lodash";
import { ChordForm, ChordFormType, mapTypeToPositions } from "./ChordForm";

export class ChordVariation {

  private _positions: number[];
  private _chordForm: ChordFormType;

  constructor(positions: number[]) {
    this._positions = positions;

    // each(ChordForm.AllChordFormTypes(), (f) => {
    //   if (this.matchesChordForm(f)) {
    //     this._chordForm = f;
    //   }
    // });
  }

  // public matchesChordForm = (
  //   form: ChordFormType
  // ): boolean => {
  //   const start = min(this._positions);
  //   const formPositions = mapTypeToPositions(form);

  //   let matches = true;
  //   each(this._positions, (pos: number, i: number) => {
  //     if (pos - start !== formPositions[i] && formPositions[i] !== null) {
  //       matches = false;
  //       return false;
  //     }
  //   });

  //   return matches;
  // };
}