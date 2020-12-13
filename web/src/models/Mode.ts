import { IOption } from "../shared/AppOptions";

export class Mode implements IOption {

  public Label: string;
  public pattern: string;

  static Ionian(): Mode {
    return new Mode('Ionian', 'wwhwwwh');
  }

  static Dorian(): Mode {
    return new Mode('Dorian', 'whwwwhw');
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

  static All(): Mode[] {
    return [
      this.Ionian(),
      this.Dorian(),
      this.Phrygian(),
      this.Lydian(),
      this.Mixolydian(),
      this.Aeolian(),
      this.Locrian(),
    ];
  }

  // TODO: make this private
  constructor(name: string, stepPattern: string) {
    this.Label = name;
    this.pattern = stepPattern;
  }

  get Steps(): string {
    return this.pattern;
  }
}