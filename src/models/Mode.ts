export class Mode {

  private name: string;
  private steps: number[];

  private pattern: string;

  static Ionian(): Mode {
    return new Mode('Ionian', 'wwhwwwh');
  }

  static Dorian(): Mode {
    return new Mode('Ionian', 'whwwwhw');
  }

  static Phrygian(): Mode {
    return new Mode('Phrygian', 'hwwwhww');
  }

  static Lydian(): Mode {
    return new Mode('Lydian', 'wwwhwwh');
  }

  static Mixolydian(): Mode {
    return new Mode('Mixolydian', 'wwhwwhw');
  }

  static Aeolian(): Mode {
    return new Mode('Aeolian', 'whwwhww');
  }

  static Locrian(): Mode {
    return new Mode('Locrian', 'hwwhwww');
  }

  constructor(name: string, stepPattern: string) {
    this.name = name;
    this.pattern = stepPattern;

    this.steps = this.convertPattern(stepPattern);
  }

  get Name(): string {
    return this.name;
  }

  get Steps(): string {
    return this.pattern;
  }

  private convertPattern(pattern: string): number[] {
    return [];
  }

}