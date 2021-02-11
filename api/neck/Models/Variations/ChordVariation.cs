using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace neck.Models.Variations
{
    public class ChordVariation : Variation<Chord>
    {
        [ForeignKey("Base")]
        public Guid ChordId { get; set; }

        public Guid FormationId { get; set; }

        [NotMapped]
        public int Offset { get; set; }

        public Formation Formation { get; set; }
         
        private ChordVariation() { }

        public ChordVariation(Chord chord, Guid tuningId, int offset, List<int?> positions)
        {
            ChordId = chord.Id;
            Base = chord;

            TuningId = tuningId;

            Offset = offset;
            Formation = new Formation(positions);
        }
    }
}
