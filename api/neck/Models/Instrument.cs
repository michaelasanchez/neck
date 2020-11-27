using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
	public class Instrument : DbEntity
	{
		public string Label { get; set; }

		public int NumStrings { get; set; }

		public Guid? DefaultTuningId { get; set; }

		public Tuning DefaultTuning { get; set; }

		public ICollection<Tuning> Tunings { get; set; }
	}
}
