using Microsoft.EntityFrameworkCore;
using neck.Enums;
using neck.Models;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class NoteRepository : GenericRepository<Note>
	{
		public NoteRepository(NeckContext context)
			: base(context)
		{
		}

		public async override Task<OperationResult<Note>> Get(Note note)
		{
			var result = await DefaultIncludes()
				.FirstOrDefaultAsync(n => n.Base == note.Base && n.Suffix == note.Suffix);
			return BuildGetOperationResult(result);
		}
	}
}
