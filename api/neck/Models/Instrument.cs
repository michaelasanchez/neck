using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace neck.Models
{
	public class Instrument : DbEntity
	{
		public string Label { get; set; }

		public int NumStrings { get; set; }

		public Guid? DefaultTuningId { get; set; }

		public Tuning DefaultTuning { get; set; }

		[JsonIgnore]
		public ICollection<Tuning> Tunings { get; set; }
	}
}
