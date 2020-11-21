using neck.Models;
using neck.Models.Db;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
    public class ChordVariationRepository : GenericRepository<ChordVariation>
    {
        public ChordVariationRepository(NeckContext context)
            : base(context)
		{
		}
    }
}
