import { IOption } from "../shared";

export class Tuning implements IOption {
  private _label: string;
  private _offsets: number[];

  constructor(label: string, offsets: number[]) {
    this._label = label;
    this._offsets = offsets;
  }

  public get Label(): string {
    return this._label;
  }

  get Offsets(): number[] {
    return this._offsets;
  }

  static Standard(): Tuning {
    return new this('Standard', [4, 9, 2, 7, 11, 4]);
  }

  static DropD(): Tuning {
    return new this('Drop D', [2, 9, 2, 7, 11, 4]);
  }

  static Half_StepDown(): Tuning {
    return new this('Half-Step Down', [3, 8, 1, 6, 10, 3]);
  }

  static Full_StepDown(): Tuning {
    return new this('Full-Step Down', [2, 7, 0, 5, 9, 2]);
  }

  static All(): Tuning[] {
    return [
      this.Standard(),
      this.DropD(),
      this.Half_StepDown(),
      this.Full_StepDown(),
    ];
  }
}