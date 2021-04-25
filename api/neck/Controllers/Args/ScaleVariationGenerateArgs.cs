using neck.Interfaces;
using neck.Models.Entity;

namespace neck.Controllers.Args
{
	public class ScaleVariationGenerateArgs : VariationGenerateArgs<Scale>
	{
		private static bool _defaultEnforceOctave = true;

		public bool? EnforceOctave { get; set; }

		public override IOperationResult Validate()
		{
			EnforceOctave = EnforceOctave == null ? _defaultEnforceOctave : EnforceOctave;

			return base.Validate();
		}
	}
}
