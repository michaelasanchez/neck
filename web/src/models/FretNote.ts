import { join, map } from 'lodash';
import { TuningNote } from '.';
import { IFretNote } from '../interfaces';

export class FretNote implements IFretNote {
  private _notes: TuningNote[];

  public String: number;
  public Fret: number;

  public Open: boolean;
  public Root: boolean;
  public Pitch: number;

  constructor(
    notes: TuningNote[],
    string: number,
    fret: number,
    open: boolean,
    root: boolean,
    pitch: number
  ) {
    this._notes = notes ?? [];
    this.String = string;
    this.Fret = fret;

    this.Open = open;
    this.Root = root;
    this.Pitch = pitch;
  }

  get Note(): TuningNote {
    return this._notes.length ? this._notes[0] : null;
  }

  get Label(): string {
    return this._notes.length
      ? join(
          map(this._notes, (n) => n.Label),
          '/'
        )
      : 'whoops';
  }
}
