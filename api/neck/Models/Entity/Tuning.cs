using neck.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace neck.Models.Entity
{
    public class Tuning : DbEntity, ILabelled
    {
        public string Label { get; set; }

        public Guid InstrumentId { get; set; }

        [JsonIgnore]
        public Instrument Instrument { get; set; }

        [JsonIgnore]
        public Instrument InstrumentDefault { get; set; }

        public List<Note> Offsets { get; set; }

        public Tuning() { }

        public Tuning(string label, List<Note> offsets)
        {
            Label = label;
            Offsets = offsets;
        }
    }
}
