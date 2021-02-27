import { TuningNote } from '.';
import { ApiEntity } from '../network/ApiEntity';
import { IOption } from '../shared';

export class Tuning extends ApiEntity implements IOption {
  private _label: string;
  private _offsets: TuningNote[];

  constructor(label: string, offsets: TuningNote[]) {
    super();
    this._label = label;
    this._offsets = offsets;
  }

  get Label(): string {
    return this._label;
  }
  set Label(value: string) {
    this._label = value;
  }

  get Offsets(): TuningNote[] {
    return this._offsets;
  }
  set Offsets(value: TuningNote[]) {
    this._offsets = value;
  }

  static All(): Tuning[] {
    return [];
  }
}
