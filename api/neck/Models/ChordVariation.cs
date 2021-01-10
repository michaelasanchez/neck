using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace neck.Models
{
	public class ChordVariation : Variation<Chord>
    {
        [ForeignKey("Base")]
        public Guid ChordId { get; set; }

        public Guid FormationId { get; set; }

        public Formation Formation { get; set; }
         
        private ChordVariation() { }

        public ChordVariation(Guid chordId, Guid tuningId, List<int?> positions)
        {
            ChordId = chordId;
            TuningId = tuningId;

            Formation = new Formation(positions);
        }
    }
}
