using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace neck.Models
{
    public class Tuning : DbEntity
    {
        public string Label { get; set; }

        public Guid InstrumentId { get; set; }

        public Instrument Instrument { get; set; }

        [JsonIgnore]
        [NotMapped]
        public Guid? InstrumentDefaultId { get; set; }

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
