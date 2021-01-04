using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
	public class ScaleVariation : DbEntity
	{
		public Guid ScaleId { get; set; }

		[NotMapped]
		public Scale Scale { get; set; }

		public Guid TuningId { get; set; }

		[NotMapped]
		public Tuning Tuning { get; set; }

		[NotMapped]
		public List<List<int?>> Positions { get; set; }

		public ScaleVariation() { }

		public ScaleVariation(Scale scale, Tuning tuning, List<List<int?>> positions)
		{
			Scale = scale;
			Tuning = tuning;
			Positions = positions;
		}
	}
}
