using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace neck.Models
{
	public class ChordVariation : DbEntity
    {
        public string Label { get; set; }

        public Guid FormationId { get; set; }

        public Formation Formation { get; set; }

        public Guid ChordId { get; set; }

        public Guid TuningId { get; set; }
         
        // TODO: remove
        public Tuning Tuning { get; set; }

        private ChordVariation() { }

        public ChordVariation(List<int?> positions, Guid chordId, Tuning tuning, string label = null)
        {
            //Label = label ?? chord?.Label;
            ChordId = chordId;
            Formation = new Formation(positions);
            Tuning = tuning;
        }
    }
}
