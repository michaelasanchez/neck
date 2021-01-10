using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
	public interface IVariationFactory<TBase, TVariation>
		where TVariation : IVariation<TBase>
	{
		public List<TVariation> GenerateVariations(TBase @base, Tuning tuning, int fretOffset, int fretSpan);

		public List<TVariation> GenerateRange(TBase @base, Tuning tuning, int fretOffset, int fretSpan, int range);
	}
}
