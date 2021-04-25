using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces.Args
{
    interface IVariationGenerateArgs<TBase>
	{
		public Guid? BaseId { get; set; }

		public Guid? TuningId { get; set; }

		public int? Offset { get; set; }

		public int? Span { get; set; }
	}
}
