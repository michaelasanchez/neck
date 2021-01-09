using Microsoft.EntityFrameworkCore;
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

		public override IQueryable<ScaleVariation> DefaultIncludes()
		{
			return _set.AsQueryable()
				.Include(v => v.Base)
				.Include(v => v.Tuning);
		}
	}
}
