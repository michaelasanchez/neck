using neck.Factories.Options;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using System.Collections.Generic;

namespace neck.Factories.Interfaces
{
	public interface IScaleVariationFactory
	{
		public List<ScaleVariation> GenerateVariations(Scale scale, Tuning tuning, int fretOffset, int fretSpan, ScaleVariationGenerateOptions options);

		public List<ScaleVariation> GenerateRange(Scale scale, Tuning tuning, int fretOffset, int fretSpan, int fretRange, ScaleVariationGenerateOptions options);
	}
}
