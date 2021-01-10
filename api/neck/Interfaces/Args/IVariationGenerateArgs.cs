using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces.Args
{
	interface IVariationGenerateArgs<TBase>
	{
		public Guid? baseId { get; set; }
		public TBase @base { get; set; }

		public Guid? tuningId { get; set; }
		public Tuning tuning { get; set; }

		public int? offset { get; set; }
		public int? span { get; set; }
	}
}
