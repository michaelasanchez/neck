using neck.Interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace neck.Models
{
	public class Instrument : DbEntity, ILabelled
	{
		public string Label { get; set; }

		public int NumStrings { get; set; }

		public Guid? DefaultTuningId { get; set; }

		public Tuning DefaultTuning { get; set; }

		[JsonIgnore]
		public virtual ICollection<Tuning> Tunings { get; set; }
	}
}
