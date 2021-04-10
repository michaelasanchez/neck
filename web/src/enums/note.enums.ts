export enum NoteValue {
  C = 0,
  D = 2,
  E = 4,
  F = 5,
  G = 7,
  A = 9,
  B = 11,
}

export enum NoteInterval {
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
  PerfectOctave = 12,
}

export enum NoteSuffix {
  DoubleFlat = -2,
  Flat = -1,
  Natural = 0,
  Sharp = 1,
  DoubleSharp = 2,
}
