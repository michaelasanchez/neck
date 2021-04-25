using neck.Interfaces;
using neck.Interfaces.Args;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Repositories;
using System;

namespace neck.Controllers.Args
{
	public abstract class VariationGenerateArgs<TBase> : IVariationGenerateArgs<TBase>
	{
		private static int _defaultOffset = 0;
		private static int _defaultSpan = 4;

		public Guid? BaseId { get; set; }
		public Guid? TuningId { get; set; }

		public int? Offset { get; set; }
		public int? Span { get; set; }
		public int? Range { get; set; }

		public virtual IOperationResult Validate()
		{
			if (BaseId == null)
			{
				var className = OperationResult.trimType(typeof(TBase));
				return OperationResult.CreateFailure($"{className}Id is required");
			}

			if (TuningId == null)
			{
				return OperationResult.CreateFailure("Tuning and TuningId cannot both be null");
			}

			Offset = Offset == null || Offset < _defaultOffset ? _defaultOffset : Offset;
			Span = Span == null || Span < 1 ? _defaultSpan : Span;

			Range = Range.HasValue && Range < Span ? Span : Range;

			return OperationResult.CreateSuccess();
		}
	}
}