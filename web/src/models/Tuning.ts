import { map } from "lodash";

import { Note, NoteSuffix } from ".";
import { ApiEntity } from "../network/ApiEntity";
import { IOption } from "../shared";

export class Tuning extends ApiEntity implements IOption {
  private _label: string;
  private _offsets: Note[];

  constructor(label: string, offsets: Note[]) {
    super();
    this._label = label;
    this._offsets = offsets;
  }

  get Label(): string { return this._label; }
  set Label(value: string) { this._label = value; }

  get Offsets(): Note[] { return this._offsets; }
  set Offsets(value: Note[]) { this._offsets = value; }

  static All(): Tuning[] {
    return [];
  }
}