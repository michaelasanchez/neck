using Microsoft.EntityFrameworkCore;
using neck.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class InstrumentRepository : GenericRepository<Instrument>
	{
		public InstrumentRepository(NeckContext context)
			: base(context)
		{
			// TODO: is there a better way to do this?
			GetAllDefaultIncludes = true;
		}

		public override IQueryable<Instrument> DefaultIncludes()
		{
			return _set.AsQueryable().Include(i => i.DefaultTuning);
		}
	}
}
