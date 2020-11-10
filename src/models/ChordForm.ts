import { countBy, indexOf } from "lodash";
import { Chord, ChordModifier } from ".";

export class ChordForm {

  private _label: string;
  private _positions: number[];

  private _barre: number;

  constructor(modifier: ChordModifier, positions: number[], label?: string) {
    this._label = label || `${Chord.getModifierLabel(modifier)} Chord`;
    this._positions = positions;

    const openCount = countBy(this._positions, p => p === 0);
    if (openCount.true > 1) {
      this._barre = indexOf(this._positions, 0);
    } else {
      this._barre = null;
    }
  }

  get Label(): string {
    return this._label;
  }

  get Positions(): number[] {
    return this._positions
  }

  get Barre(): number {
    return this._barre;
  }

  isBarre(): boolean {
    return this._barre !== null;
  }

  public static getChordForms(modifier: ChordModifier): ChordForm[] {
    switch (modifier) {
      case ChordModifier.Major:
        return this.MajorChordForms;
      case ChordModifier.Minor:
        return this.MinorChordForms;
      default:
        return [];
    }
  }

  // TODO: Eventually we'll have to take "instrument" and tuning here
  public static MajorChordForms: ChordForm[] = [
    new ChordForm(ChordModifier.Major, [null, 3, 2, 0, 1, 0]),
    new ChordForm(ChordModifier.Major, [null, 0, 2, 2, 2, 0]),
    new ChordForm(ChordModifier.Major, [3, 2, 0, 0, 0, 3]),
    new ChordForm(ChordModifier.Major, [0, 2, 2, 1, 0, 0]),
    new ChordForm(ChordModifier.Major, [null, null, 0, 2, 3, 2]),
  ];

  public static MinorChordForms: ChordForm[] = [
    new ChordForm(ChordModifier.Minor, [0, 2, 2, 0, 0, 0]),
    new ChordForm(ChordModifier.Minor, [null, 0, 2, 2, 1, 0]),
  ];
}