using neck.Enums;
using neck.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace neck.Models
{
	public class Tuning : DbEntity, ILabelled
    {
        public string Label { get; set; }

        public Guid InstrumentId { get; set; }

        [JsonIgnore]
        public Instrument Instrument { get; set; }

        [JsonIgnore]
        public Instrument InstrumentDefault { get; set; }

        public List<Note> Offsets;

        public Tuning() { }

        public Tuning(string label, List<Note> offsets)
        {
            Label = label;
            Offsets = offsets;
        }

        public static Tuning Standard()
        {
            var offsets = new List<Note>
            {
                new Note(NoteValue.E, octave: 2),
                new Note(NoteValue.A, octave: 2),
                new Note(NoteValue.D, octave: 3),
                new Note(NoteValue.G, octave: 3),
                new Note(NoteValue.B, octave: 3),
                new Note(NoteValue.E, octave: 4),
            };

            return new Tuning("Standard", offsets);
        }
    }
}
