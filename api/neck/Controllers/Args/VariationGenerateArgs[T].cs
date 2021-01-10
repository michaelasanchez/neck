using neck.Interfaces;
using neck.Interfaces.Args;
using neck.Models;
using neck.Models.Results;
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
				return OperationResult.CreateFailure($"{typeof(TBase)} instance or id is required");
			}

			if (tuning == null && tuningId == null)
			{
				return OperationResult.CreateFailure("Tuning instance or id is required");
			}

			offset = offset == null || offset < DefaultOffset ? 0 : offset;
			span = span == null || span < 1 ? DefaultSpan : span;

			return OperationResult.CreateSuccess();
		}
	}
}