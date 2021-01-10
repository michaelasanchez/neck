using neck.Interfaces;
using neck.Interfaces.Args;
using neck.Models;
using neck.Models.Results;
using neck.Repositories;
using System;

namespace neck.Controllers.Args
{
	public class VariationGenerateArgs<TBase> : IVariationGenerateArgs<TBase>
	{
		public const int DefaultOffset = 0;
		public const int DefaultSpan = 4;

		public Guid? baseId { get; set; }
		public TBase @base { get; set; }

		public Guid? tuningId { get; set; }
		public Tuning tuning { get; set; }

		public int? offset { get; set; }
		public int? span { get; set; }

		public virtual IOperationResult Validate()
		{
			if (@base == null && baseId == null)
			{
				var cl = OperationResult.trimType(typeof(TBase));
				return OperationResult.CreateFailure($"{cl} and {cl}Id cannot both be null");
			}

			if (tuning == null)
			{
				if (tuningId == null)
				{
					return OperationResult.CreateFailure("Tuning and TuningId cannot both be null");
				}
			}
			else
			{
				if (tuning.Offsets == null || tuning.Offsets.Count < 1)
				{
					return OperationResult.CreateFailure("Tuning offsets are missing");
				}
			}

			offset = offset == null || offset < DefaultOffset ? 0 : offset;
			span = span == null || span < 1 ? DefaultSpan : span;

			return OperationResult.CreateSuccess();
		}
	}
}