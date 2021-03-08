import { isUndefined } from 'lodash';

import { ScaleDegree } from '.';

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

export enum NoteInterval
{
    Root = 0,
    //PerfectUnison = 0,
    MinorSecond = 1,
    MajorSecond = 2,
    MinorThird = 3,
    MajorThird = 4,
    PerfectFourth = 5,
    DiminishedFifth = 6,
    AugmentedFourth = 6,
    PerfectFifth = 7,
    MinorSixth = 8,
    MajorSixth = 9,
    MinorSeventh = 10,
    MajorSeventh = 11,
    PerfectOctave = 12
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
  DoubleSharp = '\ud834\udd2a',
  DoubleFlat = '\ud834\udd2b',
}


export class Note {

  public static NUM_NOTES = 12;

  public Base: NoteValue;
  public Suffix: NoteSuffix;

  public Degree: ScaleDegree;

  public Interval: NoteInterval;

  constructor(value: NoteValue = NoteValue.C, suffix: NoteSuffix = NoteSuffix.Natural) {
    this.Base = value % Note.NUM_NOTES;
    this.Suffix = suffix;
  }

  private ModifiedValue(): NoteValue {
    return this.Base + this.Suffix;
  }

  private SuffixLabel(suffix: NoteSuffix, long = false) {
    switch (suffix) {
      case NoteSuffix.DoubleFlat:
        return long ? 'Double Flat' : `${NoteSuffixLabel.DoubleFlat }`;
      case NoteSuffix.Flat:
        return long ? 'Flat' : `${NoteSuffixLabel.Flat}`;
      case NoteSuffix.Natural:
        return long ? 'Natural' : '';
      case NoteSuffix.Sharp:
        return long ? 'Sharp' : `${NoteSuffixLabel.Sharp}`;
      case NoteSuffix.DoubleSharp:
        return long ? 'Double Sharp' : `${NoteSuffixLabel.DoubleSharp}`;
    }
  }

  get Label(): string {
    return NoteValue[this.Base] ? `${NoteValue[this.Base]}${this.SuffixLabel(this.Suffix)}` : 'ERROR';
  }

  get LongLabel(): string {
    return NoteValue[this.Base] ? `${NoteValue[this.Base]} ${this.SuffixLabel(this.Suffix, true)}` : 'ERROR';
  }

  get Value(): NoteValue {
    return this.ModifiedValue();
  }

  get Pitch(): number {
    return (this.Base + this.Suffix) % Note.NUM_NOTES;
  }

  static A(): Note {
    return new Note(NoteValue.A);
  }

  static B(): Note {
    return new Note(NoteValue.B);
  }

  static C(): Note {
    return new Note(NoteValue.C);
  }

  static D(): Note {
    return new Note(NoteValue.D);
  }

  static E(): Note {
    return new Note(NoteValue.E);
  }

  static F(): Note {
    return new Note(NoteValue.F);
  }

  static G(): Note {
    return new this(NoteValue.G);
  }

  public Natural(): Note {
    this.Suffix = NoteSuffix.Natural;
    return this;
  }

  public Sharp(): Note {
    this.Suffix = NoteSuffix.Sharp;
    return this;
  }

  public DoubleSharp(): Note {
    this.Suffix = NoteSuffix.DoubleSharp;
    return this;
  }

  public Flat(): Note {
    this.Suffix = NoteSuffix.Flat;
    return this;
  }

  public DoubleFlat(): Note {
    this.Suffix = NoteSuffix.DoubleFlat;
    return this;
  }

  public HalfStepUp(): Note {
    let pitch = this.Pitch;
    let next: Note;

    if (isUndefined(NoteValue[(pitch + 1) % Note.NUM_NOTES])) {
      if (pitch != this.Base) {
        next = new Note(pitch, NoteSuffix.Sharp);
      } else {
        next = new Note(pitch + 2, NoteSuffix.Flat);
      }
    } else {
      if (pitch + 1 == this.Base) {
        next = new Note(pitch + 2, NoteSuffix.Flat);
      } else {
        next = new Note(pitch + 1);
      }
    }

    return next;
  }

  //  C           D           E     F           G           A           B   
  //        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
  //  B#                      Fb    E#                                  Cb
  //  0     1     2     3     4     5     6     7     8     9     10    11 

  public WholeStepUp(): Note {
    let pitch = this.Pitch;
    let next: Note;

    if (isUndefined(NoteValue[(pitch + 2) % Note.NUM_NOTES])) {
      if (pitch + 1 == this.Base) {
        next = new Note(pitch + 3, NoteSuffix.Flat);
      } else {
        next = new Note(pitch + 1, NoteSuffix.Sharp);
      }
    } else {
      if (pitch - this.Base > 0) {
        next = new Note(pitch + 1, NoteSuffix.Sharp);
      } else {
        next = new Note(pitch + 2);
      }
    }

    return next;
  }
}