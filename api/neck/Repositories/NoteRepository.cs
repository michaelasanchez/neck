using neck.Models;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class NoteRepository : GenericRepository<Note>
	{
		public NoteRepository(NeckContext context)
			: base(context)
		{
		}

		public override Task<Note> Exists(Note note)
		{
			return FirstOrDefault(n => n.Base == note.Base && n.Suffix == note.Suffix);
		}

	}
}
