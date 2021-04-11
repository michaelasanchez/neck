import { isArray, join, map } from 'lodash';
import { TuningNote } from '.';
import { IFretNote } from '../interfaces';

export class FretNote implements IFretNote {
  public _notes: TuningNote[];

  public String: number;
  public Fret: number;

  public Open: boolean;
  public Root: boolean;

  constructor(notes: TuningNote[], string: number, fret: number) {
    this._notes = notes ?? [];
    this.String = string;
    this.Fret = fret;
  }

  get Note(): TuningNote {
    return this._notes.length ? this._notes[0] : null;
  }

  get Label(): string {
    return this._notes.length ? join(map(this._notes, n => n.Label), '/') : 'oh yeah';
  }
}
