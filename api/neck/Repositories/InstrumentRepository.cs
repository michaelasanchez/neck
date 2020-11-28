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
		}

		public override Task<IEnumerable<Instrument>> GetAll()
		{
			return Task.FromResult(_queryable.Include(i => i.DefaultTuning).AsEnumerable());
		}
	}
}
