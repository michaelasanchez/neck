using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class ScaleVariationRepository : GenericRepository<ScaleVariation>
	{
		public ScaleVariationRepository(NeckContext context)
			: base(context)
		{
		}
	}
}
