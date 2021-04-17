using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Results
{
	public class GenerateResponseHeader<TVariation>
	{
		public Guid BaseId { get; set; }

		public Guid InstrumentId { get; set; }

		public Guid TuningId { get; set; }

		public int Offset { get; set; }

		public int? Range { get; set; }

		public int Span { get; set; }

		public List<Key> Keys { get; set; }

		public List<TVariation> Variations { get; set; }
	}
}
