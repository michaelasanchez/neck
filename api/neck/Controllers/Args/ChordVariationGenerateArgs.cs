using neck.Interfaces;
using neck.Models;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers.Args
{
	public class ChordVariationGenerateArgs : VariationGenerateArgs<Chord>
	{
		public override IOperationResult Validate()
		{
			var result = base.Validate();
			if (!result.Success)
			{
				return result;
			}

			if (@base.Root == null)
			{
				return OperationResult.CreateFailure("Chord missing root note");
			}

			return OperationResult.CreateSuccess();
		}
	}
}
