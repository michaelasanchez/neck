using neck.Models;

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
