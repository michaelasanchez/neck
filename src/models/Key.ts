import { Mode } from ".";
import { Note } from "./note";
import { IOption } from "./AppOptions";
import { Scale } from "./scale";

export enum KeyType {
  Major = 'Major',
  Minor = 'Minor',
}

export class Key implements IOption {

  private _tonic: Note;
  private _type: KeyType;

  private _scale: Scale;

  constructor(tonic: Note, type?: KeyType) {
    this._tonic = tonic;
    this._type = type || KeyType.Major;
  }

  get Tonic(): Note {
    return this._tonic;
  }

  get Label(): string {
    return this._tonic.toString();
  }

  get RelativeMajor(): Key {
    if (this._type === KeyType.Minor) return null;

    const scale = new Scale(this._tonic, Mode.Dorian());
    return new Key(scale.Notes[2]);
  }

  get RelativeMinor(): Key {
    if (this._type === KeyType.Major) return null;

    const scale = new Scale(this._tonic, Mode.Ionian());
    return new Key(scale.Notes[5]);
  }

  public Sharp(): Key {
    this._tonic = this._tonic.Sharp();
    return this;
  }

  public DoubleSharp(): Key {
    this._tonic = this._tonic.DoubleSharp();
    return this;
  }

  public Flat(): Key {
    this._tonic = this._tonic.Flat();
    return this;
  }

  public DoubleFlat(): Key {
    this._tonic = this._tonic.DoubleFlat();
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