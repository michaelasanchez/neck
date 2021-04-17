using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces.Args
{
    interface IVariationGenerateArgs<TBase>
	{
		public Guid? baseId { get; set; }

		public Guid? tuningId { get; set; }

		public int? offset { get; set; }

		public int? span { get; set; }
	}
}
