import { filter, times } from 'lodash';
import { FretNote, Instrument, Note, Scale, Tuning, TuningNote } from '.';

const calcNotes = (instrument: Instrument, tuning: Tuning, scale: Scale) => {
  if (!tuning) {
    tuning = instrument.DefaultTuning;
    if (!tuning) {
      return null;
    }
  }

  return times(instrument.NumStrings, (s) => {
    const offset = tuning.Offsets[s];
    if (!offset) return null;

    return times(instrument.NumFrets, (f) => {
      let offsetNoteValue = f + offset.Pitch;
      let pitch = offsetNoteValue % Note.NUM_NOTES;
      let octave = Math.floor(offsetNoteValue / Note.NUM_NOTES) + offset.Octave;

      // Check if Note exists for current fret number
      let current = filter(scale.Notes, (note: Note) => note.Pitch == pitch);

      let note = null;
      if (!!current.length) {
        note = current[0] as TuningNote;
        note.Octave = octave;
      }
      return note
        ? new FretNote(note.Base, note.Suffix, note.Octave, s, f)
        : null;
    });
  });
};

export class FretMap {
  public Notes: FretNote[][];

  constructor(instrument: Instrument, tuning: Tuning, scale: Scale) {
    this.Notes = calcNotes(instrument, tuning, scale);
  }
}
