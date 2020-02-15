export class Tuning {
  private name: string;
  private offsets: number[];

  constructor(name: string, offsets: number[]) {
    this.name = name;
    this.offsets = offsets;
  }

  get Name(): string {
    return this.name;
  }

  get Offsets(): number[] {
    return this.offsets;
  }

  static Standard(): Tuning {
    return new this('Standard', [4, 9, 2, 7, 11, 4]);
  }

  static DropD(): Tuning {
    return new this('Standard', [2, 9, 2, 7, 11, 4]);
  }

  static Half_StepDown(): Tuning {
    return new this('Drop D', [3, 8, 1, 6, 10, 3]);
  }

  static Full_StepDown(): Tuning {
    return new this('Full-Step Down', [2, 7, 0, 5, 9, 2]);
  }
}