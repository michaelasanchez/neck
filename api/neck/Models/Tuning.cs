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

        // Offset from C (noteValue 0)
        public List<int> Offsets;

        public Tuning() { }

        public Tuning(string label, List<int> offsets)
        {
            Label = label;
            Offsets = offsets;
        }

        public static Tuning Standard()
        {
            return new Tuning("Standard", new List<int> { 4, 9, 2, 7, 11, 4 });
        }
    }
}
