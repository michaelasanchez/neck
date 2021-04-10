using neck.Enums;
using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Entity.Variations
{
    public class ScaleVariation : Variation<Scale>
    {
        [ForeignKey("Base")]
        public Guid ScaleId { get; set; }

        [NotMapped]
        public int Offset { get; set; }

        [NotMapped]
        public List<List<ScaleDegree?>> Positions { get; set; }

        // TODO: Is this used anywhere on FE?
        [NotMapped]
        public List<ScalePosition> Tonics { get; set; }

        public ScaleVariation() { }

        public ScaleVariation(Scale scale, Guid tuningId, int offset, List<List<ScaleDegree?>> positions)
        {
            ScaleId = scale.Id;
            Base = scale;

            TuningId = tuningId;

            Offset = offset;
            Positions = positions;
        }
    }
}
