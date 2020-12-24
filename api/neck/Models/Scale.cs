using neck.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
    public class Scale
    {
        private Note _root;

        private Mode _mode;

        private List<Note> _notes;

        public Scale(Note root, Mode mode)
        {
            _root = root;
            _root.Degree = ScaleDegree.Tonic;
            _root.Interval = Interval.Root;

            _mode = mode;
            _notes = calcNotes(_root, _mode);
        }

        public Note Root
        {
            get => _root;
            set {
                _root = value;
                _notes = calcNotes(_root, _mode);
            }
        }

        public Mode Mode 
        {
            get => _mode;
            set {
                _mode = value;
                _notes = calcNotes(_root, _mode);
            }
        }

		public List<Note> Notes { get => _notes; }

		private List<Note> calcNotes(Note root, Mode mode)
        {
            var notes = new List<Note> { root };

            mode.Steps.ForEach(step =>
            {
                var nextNote = calcNextNote(notes.Last(), step);
                if (nextNote.Pitch != root.Pitch) notes.Add(nextNote);
            });

            return notes;
        }

        private Note calcNextNote(Note prevNote, Step step)
        {
            var nextNote = step == Step.Whole ? prevNote.WholeStepUp() : prevNote.HalfStepUp();

            nextNote.Degree = prevNote.Degree + 1;
            nextNote.Interval = calcInterval(nextNote.Pitch, Root.Pitch);

            return nextNote;
        }

        private Interval calcInterval(int pitch, int rootPitch)
		{
            return (Interval)((pitch - rootPitch + Models.Notes.Count) % Models.Notes.Count);
        }
    }
}
