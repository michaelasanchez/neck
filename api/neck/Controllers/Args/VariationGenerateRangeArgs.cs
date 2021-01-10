using neck.Interfaces;
using neck.Interfaces.Args;

namespace neck.Controllers.Args
{
	public class VariationGenerateRangeArgs<TBase> : VariationGenerateArgs<TBase>, IVariationGenerateRangeArgs<TBase>
	{
		public const int DefaultRange = 12;

		public int? range { get; set; }

		public override IOperationResult Validate()
		{
			range = range == null || range < 1 ? DefaultRange : range;

			return base.Validate();
		}
	}
}
