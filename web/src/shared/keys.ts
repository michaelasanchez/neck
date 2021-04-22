import { Key } from '../models';

interface KeyValues {
  [arrayKey: number]: Key[];
}

export class Keys {
  static DropdownValues(): Key[] {
    return [
      Key.C().Sharp(),
      Key.F().Sharp(),
      Key.E(),
      Key.B(),
      Key.A(),
      Key.D(),
      Key.G(),
      Key.C(),
      Key.F(),
      Key.B().Flat(),
      Key.E().Flat(),
      Key.A().Flat(),
      Key.D().Flat(),
      Key.G().Flat(),
      Key.C().Flat(),
    ];
  }

  static Whole(): Key[] {
    return [Key.C(), Key.D(), Key.E(), Key.F(), Key.G(), Key.A(), Key.B()];
  }
  static Major() {
    return [
      [Key.C()],
      [Key.G()],
      [Key.D()],
      [Key.A()],
      [Key.E()],
      [Key.B()],
      // Key.G().Flat(),
      [Key.G().Flat(), Key.F().Sharp()],
      [Key.D().Flat()],
      [Key.A().Flat()],
      [Key.E().Flat()],
      [Key.B().Flat()],
      [Key.F()],
    ];
  }
  static Minor() {
    return [
      [Key.A().Minor()],
      [Key.E().Minor()],
      [Key.B().Minor()],
      [Key.F().Sharp().Minor()],
      [Key.C().Sharp().Minor()],
      [Key.G().Sharp().Minor()],
      // Key.E().Flat().Minor(),
      [Key.E().Flat().Minor(), Key.D().Sharp().Minor()],
      [Key.B().Flat().Minor()],
      [Key.F().Minor()],
      [Key.C().Minor()],
      [Key.G().Minor()],
      [Key.D().Minor()],
    ];
  }

  //  C           D           E     F           G           A           B
  //        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
  //
  //  B#                      Fb    E#                                  Cb
  //  0     1     2     3     4     5     6     7     8     9     10    11

  static SliderValues(): KeyValues {
    return {
      0: [Key.C()],
      1: [Key.C().Sharp(), Key.D().Flat()],
      2: [Key.D()],
      3: [Key.E().Flat()],
      4: [Key.E()],
      5: [Key.F()],
      6: [Key.F().Sharp(), Key.G().Flat()],
      7: [Key.G()],
      8: [Key.A().Flat()],
      9: [Key.A()],
      10: [Key.B().Flat()],
      11: [Key.B(), Key.C().Flat()],
    };
  }

  static SliderValueWithTheoretical(): KeyValues {
    return {
      0: [Key.C(), Key.B().Sharp()],
      1: [Key.C().Sharp(), Key.D().Flat()],
      2: [Key.D()],
      3: [Key.D().Sharp(), Key.E().Flat()],
      4: [Key.E(), Key.F().Flat()],
      5: [Key.F(), Key.E().Sharp()],
      6: [Key.F().Sharp(), Key.G().Flat()],
      7: [Key.G()],
      8: [Key.G().Sharp(), Key.A().Flat()],
      9: [Key.A()],
      10: [Key.A().Sharp(), Key.B().Flat()],
      11: [Key.B(), Key.C().Flat()],
    };
  }
}
