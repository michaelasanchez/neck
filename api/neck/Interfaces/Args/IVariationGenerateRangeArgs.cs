using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces.Args
{
	interface IVariationGenerateRangeArgs<TBase> : IVariationGenerateArgs<TBase>
	{
		public int? range { get; set; }
	}
}
