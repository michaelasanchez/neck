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
            _root.Degree = 0;

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
                var prevNote = notes.Last();
                var nextNote = step == Step.Whole ? prevNote.WholeStepUp() : prevNote.HalfStepUp();
                nextNote.Degree = notes.Count;
                if (nextNote.Modified != root.Modified) notes.Add(nextNote);
            });

            return notes;
        }
    }
}
