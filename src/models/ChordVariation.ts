import { each, min } from "lodash";

import { Tuning } from ".";
import { ChordModifier } from "./chord";
import { ChordForm } from "./ChordForm";

export class ChordVariation {

  private _positions: number[];
  private _bar: number;

  private _chordForm: ChordForm;

  constructor(positions: number[], modifier?: ChordModifier, tuning?: Tuning) {
    this._positions = positions;

    if (modifier !== null && !!tuning) {
      each(ChordForm.getChordForms(ChordModifier.Major), (f) => {
        if (this.matchesChordForm(f, true)) {
          this._chordForm = f;
        }
      });
    }
  }

  get Positions(): number[] {
    return this._positions;
  }

  get ChordForm(): ChordForm {
    return this._chordForm;
  }

  public hasChordForm = (): boolean => !!this._chordForm;

  public matchesChordForm = (
    chordForm: ChordForm,
    convert: boolean = false,
  ): boolean => {
    const start = min(this._positions);

    let matches = true;
    each(this._positions, (pos: number, i: number) => {
      const formPosition = chordForm.Positions[i];
      if (formPosition !== pos - start && formPosition !== null) {
        matches = false;
        return false; // break
      }
    });

    if (matches && convert) {
      each(chordForm.Positions, (p: number, i: number) => {
        if (p === null) this._positions[i] = null;
      });
    }

    return matches;
  };

  public Equals = (chordVariation: ChordVariation): boolean => {
    let matches = true;

    // TODO: Once ChordVariation can be unique we can simplify here
    each(chordVariation.Positions, (pos: number, i: number) => {
      if (pos !== this._positions[i]) {
        matches = false;
        return false;
      }
    });

    return matches;
  }
}