using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
	public class ScaleVariation : DbEntity
	{
		public Guid ScaleId;

		public Scale Scale;

		public int Range;

		public List<List<Note>> Positions;
	}
}
