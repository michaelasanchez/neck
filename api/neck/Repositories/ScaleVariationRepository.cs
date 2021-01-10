using Microsoft.EntityFrameworkCore;
using neck.Models;
using neck.Models.Variations;
using System.Linq;

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
