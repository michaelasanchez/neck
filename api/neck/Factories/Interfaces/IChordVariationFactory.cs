using neck.Factories.Options;
using neck.Models.Entity;
using neck.Models.Entity.Variations;
using System.Collections.Generic;

namespace neck.Factories.Interfaces
{
	public interface IChordVariationFactory
	{
		public List<ChordVariation> GenerateVariations(Chord chord, Tuning tuning, int fretOffset, int fretSpan, ChordVariationGenerateOptions options);

		public List<ChordVariation> GenerateRange(Chord chord, Tuning tuning, int fretOffset, int fretSpan, int fretRange, ChordVariationGenerateOptions options);
	}
}
