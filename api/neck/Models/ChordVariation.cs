using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace neck.Models
{
	public class ChordVariation : DbEntity
    {
        public string Label { get; set; }

        public Guid FormationId { get; set;
        }
        public Formation Formation { get; set; }

        public Guid ChordId { get; set; }
        
        public Chord Chord { get; set; }

        public Guid TuningId { get; set; }
             
        public Tuning Tuning { get; set; }

        private ChordVariation() { }

        public ChordVariation(List<int?> positions, Chord chord, Tuning tuning, string label = null)
        {
            Label = label ?? chord?.Label;
            Formation = new Formation(positions);
            Chord = chord;
            Tuning = tuning;
        }
    }
}
