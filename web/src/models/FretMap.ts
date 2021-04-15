import { filter, isUndefined, times } from 'lodash';
import { FretNote, Instrument, Note, Scale, Tuning, TuningNote } from '.';
import { NoteSuffix, NoteValue } from '../enums';

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

      if (note == null && !isUndefined(NoteValue[pitch])) {
        note = new TuningNote(pitch, 0, octave);
      }

      let notes = null;
      if (isUndefined(NoteValue[pitch])) {
        notes = [
          new TuningNote(pitch - 1, NoteSuffix.Sharp, octave),
          new TuningNote(pitch + 1, NoteSuffix.Flat, octave),
        ];
      }

      // TODO: should this go in FretNote constructor?
      const open = f == 0;
      const root = (note || notes[0]).Pitch == scale.Tonic.Pitch;

      return new FretNote(!!note ? [note] : notes, s, f, open, root, pitch);
    });
  });
};

export class FretMap {
  public Notes: FretNote[][];

  constructor(instrument: Instrument, tuning: Tuning, scale: Scale) {
    this.Notes = calcNotes(instrument, tuning, scale);
  }
}
