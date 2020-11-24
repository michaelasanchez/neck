import { isUndefined } from 'lodash';

//  C           D           E     F           G           A           B   
//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
//  B#                      Fb    E#                                  Cb
//  0     1     2     3     4     5     6     7     8     9     10    11 

export enum NoteValue {
  C = 0,
  D = 2,
  E = 4,
  F = 5,
  G = 7,
  A = 9,
  B = 11,
}

export enum NoteSuffix {
  DoubleFlat = -2,
  Flat = -1,
  Natural = 0,
  Sharp = 1,
  DoubleSharp = 2,
}

export enum NoteSuffixLabel {
  Sharp = '\u266f',
  Flat = '\u266d',
}

const SharpSymbol = '\u266f';
const FlatSymbol = '\u266f';

export class Note {

  public static NUM_NOTES = 12;

  private base: NoteValue;
  private suffix: NoteSuffix;

  private degree: number;

  constructor(value: NoteValue = NoteValue.C, suffix: NoteSuffix = NoteSuffix.Natural) {
    this.base = value % Note.NUM_NOTES;
    this.Suffix = suffix;
  }

  private ModifiedValue(): NoteValue {
    return this.base + this.suffix;
  }

  private SuffixLabel(suffix: NoteSuffix, long = false) {
    switch (suffix) {
      case NoteSuffix.DoubleFlat:
        return long ? 'Double Flat' : `${FlatSymbol}${FlatSymbol}`;
      case NoteSuffix.Flat:
        return long ? 'Flat' : `${FlatSymbol}`;
      case NoteSuffix.Natural:
        return long ? 'Natural' : '';
      case NoteSuffix.Sharp:
        return long ? 'Sharp' : `${SharpSymbol}`;
      case NoteSuffix.DoubleSharp:
        return long ? 'Double Sharp' : `${SharpSymbol}${SharpSymbol}`;
    }
  }

  get Label(): string {
    // Cheap visual test
    return NoteValue[this.base] ? `${NoteValue[this.base]}${this.SuffixLabel(this.suffix)}` : 'ERROR';
  }

  get LongLabel(): string {
    return NoteValue[this.base] ? `${NoteValue[this.base]} ${this.SuffixLabel(this.suffix, true)}` : 'ERROR';
  }

  get Value(): NoteValue {
    return this.ModifiedValue();
  }

  get Base(): NoteValue {
    return this.base;
  }

  set Base(value: NoteValue) {
    this.base = value;
  }

  get Modified(): number {
    return (this.base + this.suffix) % Note.NUM_NOTES;
  }

  get Suffix(): NoteSuffix {
    return this.suffix;
  }

  set Suffix(suffix: NoteSuffix) {
    this.suffix = suffix;
  }

  get Degree(): number {
    return this.degree;
  }

  // Only assigned in Scale
  set Degree(degree: number) {
    this.degree = degree;
  }

  static A(): Note {
    return new this(NoteValue.A);
  }

  static B(): Note {
    return new this(NoteValue.B);
  }

  static C(): Note {
    return new this(NoteValue.C);
  }

  static D(): Note {
    return new this(NoteValue.D);
  }

  static E(): Note {
    return new this(NoteValue.E);
  }

  static F(): Note {
    return new this(NoteValue.F);
  }

  static G(): Note {
    return new this(NoteValue.G);
  }

  public Natural(): Note {
    this.suffix = NoteSuffix.Natural;
    return this;
  }

  public Sharp(): Note {
    this.suffix = NoteSuffix.Sharp;
    return this;
  }

  public DoubleSharp(): Note {
    this.suffix = NoteSuffix.DoubleSharp;
    return this;
  }

  public Flat(): Note {
    this.suffix = NoteSuffix.Flat;
    return this;
  }

  public DoubleFlat(): Note {
    this.suffix = NoteSuffix.DoubleFlat;
    return this;
  }

  public HalfStepUp(): Note {
    let mod = this.Modified;
    let next: Note;

    if (isUndefined(NoteValue[(mod + 1) % Note.NUM_NOTES])) {
      if (mod != this.base) {
        next = new Note(mod, NoteSuffix.Sharp);
      } else {
        next = new Note(mod + 2, NoteSuffix.Flat);
      }
    } else {
      if (mod + 1 == this.base) {
        next = new Note(mod + 2, NoteSuffix.Flat);
      } else {
        next = new Note(mod + 1);
      }
    }

    return next;
  }

  //  C           D           E     F           G           A           B   
  //        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
  //  B#                      Fb    E#                                  Cb
  //  0     1     2     3     4     5     6     7     8     9     10    11 

  public WholeStepUp(): Note {
    let mod = this.Modified;
    let next: Note;

    if (isUndefined(NoteValue[(mod + 2) % Note.NUM_NOTES])) {
      if (mod + 1 == this.base) {
        next = new Note(mod + 3, NoteSuffix.Flat);
      } else {
        next = new Note(mod + 1, NoteSuffix.Sharp);
      }
    } else {
      if (mod - this.base > 0) {
        next = new Note(mod + 1, NoteSuffix.Sharp);
      } else {
        next = new Note(mod + 2);
      }
    }

    return next;
  }
}