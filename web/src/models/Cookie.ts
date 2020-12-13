import { Chord, ChordModifier, Key, Mode, Note } from ".";

class Cookie {
  chordId: string;
  instrumentId: string;
  
  key: Key; 
  mode: Mode;

  ui: CookieUi;

  static Default(): Cookie {
    return {
      chordId: null,
      instrumentId: null,

      key: Key.C(),
      mode: Mode.Ionian(),
      ui: {
        numFrets: 20
      }
    } as Cookie;
  }
}

class CookieUi {
  numFrets: number
}

export default Cookie;