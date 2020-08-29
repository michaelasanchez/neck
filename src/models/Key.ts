import { Note } from "./Note";
import { IOption } from "./Options";

export class Key implements IOption{

  private root: Note;

  constructor(root:Note) {
    this.root = root;
  }

  get Root(): Note {
    return this.root;
  }

  public get Name(): string {
    return this.root.toString();
  }

  public Flat(): Key {
    this.root = this.root.Flat();
    return this;
  }

  public Sharp(): Key {
    this.root = this.root.Sharp();
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

export class Keys {

  static All(): Key[] {
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
}