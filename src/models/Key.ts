import { Note } from "./note";
import { IOption } from "./options";


export class Key implements IOption {

  private root: Note;

  constructor(root: Note) {
    this.root = root;
  }

  get Root(): Note {
    return this.root;
  }

  public get Name(): string {
    return this.root.toString();
  }

  public Sharp(): Key {
    this.root = this.root.Sharp();
    return this;
  }

  public DoubleSharp(): Key {
    this.root = this.root.DoubleSharp();
    return this;
  }

  public Flat(): Key {
    this.root = this.root.Flat();
    return this;
  }

  public DoubleFlat(): Key {
    this.root = this.root.DoubleFlat();
    return this;
  }

  static A(): Key {
    return new this(Note.A());
  }

  static B(): Key {
    return new this(Note.B());
  }

  static C(): Key {
    return new this(Note.C());
  }

  static D(): Key {
    return new this(Note.D());
  }

  static E(): Key {
    return new this(Note.E());
  }

  static F(): Key {
    return new this(Note.F());
  }

  static G(): Key {
    return new this(Note.G());
  }
}

Key.prototype.toString = function () {
  return this.Name;
}

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
    return [
      Key.C(),
      Key.D(),
      Key.E(),
      Key.F(),
      Key.G(),
      Key.A(),
      Key.B(),
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
    }
  }

  static SliderValueWithTheoretical(): KeyValues {
    return {
      0: [Key.C()/*, Key.B().Sharp()*/],
      1: [Key.C().Sharp(), Key.D().Flat()],
      2: [Key.D()],
      3: [Key.D().Sharp(), Key.E().Flat()],
      4: [Key.E()/*, Key.F().Flat()*/],
      5: [Key.F()/*, Key.E().Sharp()*/],
      6: [Key.F().Sharp(), Key.G().Flat()],
      7: [Key.G()],
      8: [Key.G().Sharp(), Key.A().Flat()],
      9: [Key.A()],
      10: [Key.A().Sharp(), Key.B().Flat()],
      11: [Key.B(), Key.C().Flat()],
    }
  }

}