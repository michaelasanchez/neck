
export enum ScaleStep {
    Whole = 'w',
    Half = 'h',
  }
  export enum ScaleMode {
    Ionian = 'wwhwwwh', // major
    Dorian = 'whwwwhw',
    Phrygian = 'hwwwhww',
    Lydian = 'wwwhwwh',
    Mixolydian = 'wwhwwhw',
    Aeolian = 'whwwhww', // natural minor
    Locrian = 'hwwhwww',
  }
  
  export enum ScaleDegree {
    Tonic = 1,
    Supertonic = 2,
    Mediant = 3,
    Subdominant = 4,
    Dominant = 5,
    Submediant = 6,
    Subtonic = 7, // in the natual minor scale
    LeadingTone = 7, // in the major scale
  }
  
  export enum ScaleType {
    Diatonic,
    NaturalMinor,
    Chromatic,
    Pentatonic,
  }
  