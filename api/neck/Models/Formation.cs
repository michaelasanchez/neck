using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace neck.Models
{
	public class Formation : DbEntity
	{
		// Position from string nut or open note
		public List<int?> Positions;

		[NotMapped]
		public bool isBarre { get; set; }

		public ICollection<ChordVariation> ChordVariations;

		public Formation() { }

		public Formation(List<int?> positions)
		{
			Positions = positions;
		}
	}
}
