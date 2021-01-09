using neck.Interfaces;
using neck.Models;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers.Args
{
	public class ChordVariationGenerateRangeArgs : ChordVariationGenerateArgs
	{
		public const int DefaultRange = 12;

		public int? range;

		public override IOperationResult Validate()
		{
			range = range == null || range < 1 ? DefaultRange : range;

			return base.Validate();
		}
	}
}
