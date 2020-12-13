import { Chord, ChordModifier, Key, Mode, Note } from ".";

class Cookie {
  chordId: string;
  instrumentId: string;
  
  key: Key; 
  mode: Mode;

  neck: NeckOptions;

  static Default(): Cookie {
    return {
      chordId: null,
      instrumentId: null,

      key: Key.C(),
      mode: Mode.Ionian(),
      neck: {
        numFrets: 14
      }
    } as Cookie;
  }
}

class NeckOptions {
  numFrets: number
}

export default Cookie;