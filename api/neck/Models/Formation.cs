using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
	public class Formation : DbEntity
	{
		// Position from string nut or open note
		public List<int?> Positions;

		public ICollection<ChordVariation> ChordVariations;

		public Formation() { }

		public Formation(List<int?> positions)
		{
			Positions = positions;
		}

		public int Hash {
			get => Positions.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode()));
			set => Hash = value;
		}
	}
}
