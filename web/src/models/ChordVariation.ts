import { each, min } from "lodash";

import { Chord, ChordForm, Tuning } from ".";

export class ChordVariation {

  private _positions: number[];

  public Barres: number[];
  // private _barre: number[];

  private _chordForm: ChordForm;

  constructor(positions: number[], barres: number[], chord?: Chord, tuning?: Tuning, convert: boolean = false) {
    this._positions = positions;
    this.Barres = barres;
    // this._barre = new Array(this._positions.length).fill(null);

    if (chord !== null && !!tuning) {
      each(ChordForm.getChordForms(chord.Modifier), (f) => {
        if (this.matchesChordForm(f, convert)) {
          this._chordForm = f;
        }
      });
    }
  }

  get Positions(): number[] {
    return this._positions;
  }

  // get Barre(): number[] {
  //   return this._barre;
  // }

  get ChordForm(): ChordForm {
    return this._chordForm;
  }

  hasChordForm = (): boolean => !!this._chordForm;

  matchesChordForm = (
    chordForm: ChordForm,
    convert: boolean,
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

        // Muted
        if (p === null) this._positions[i] = null;

        // Barre
        if (chordForm.isBarre()) {
          const barrePosition = this._positions[chordForm.Barre];
          if (chordForm.Barre <= i && barrePosition > 0) {
            // this._barre[i] = barrePosition;
          }
        }

      });
    }

    return matches;
  };

  // private calcBarre() {
  //   this._barre = new Array(this._positions.length).fill(null);

  //   const barrePosition = this._positions[chordForm.Barre];
  //   if (chordForm.Barre <= i && barrePosition > 0) {
  //     this._barre[i] = barrePosition;
  //   }
  // }

  Equals = (chordVariation: ChordVariation): boolean => {
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