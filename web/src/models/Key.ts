
import { Mode, Note, Scale } from ".";
import { IOption } from "../shared/AppOptions";

export enum KeyType {
  Major = 'Major',
  Minor = 'Minor',
}

export class Key implements IOption {

  public Tonic: Note;
  public Type: KeyType;
  
  public Label: string;

  public Scale: Scale;

  constructor(tonic: Note, type?: KeyType) {
    this.Tonic = tonic;
    this.Type = type || KeyType.Major;
  }

  get RelativeMajor(): Key {
    if (this.Type === KeyType.Minor) return null;

    const scale = new Scale(this.Tonic, Mode.Dorian());
    return new Key(scale.Notes[2]);
  }

  get RelativeMinor(): Key {
    if (this.Type === KeyType.Major) return null;

    const scale = new Scale(this.Tonic, Mode.Ionian());
    return new Key(scale.Notes[5]);
  }

  public Sharp(): Key {
    this.Tonic = this.Tonic.Sharp();
    return this;
  }

  public DoubleSharp(): Key {
    this.Tonic = this.Tonic.DoubleSharp();
    return this;
  }

  public Flat(): Key {
    this.Tonic = this.Tonic.Flat();
    return this;
  }

  public DoubleFlat(): Key {
    this.Tonic = this.Tonic.DoubleFlat();
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