using neck.Factories.Options;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using System.Collections.Generic;

namespace neck.Factories.Interfaces
{
	public interface IScaleVariationFactory
	{
		public List<ScaleVariation> Generate(Scale scale, Tuning tuning, int fretOffset, int fretSpan, int fretRange, ScaleVariationGenerateOptions options);
	}
}
