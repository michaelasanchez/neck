using Microsoft.AspNetCore.Mvc;
using neck.Controllers.Args;
using neck.Enums;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Repositories;
using System;
using System.Threading.Tasks;
using static neck.Enums.ChordEnums;

namespace neck.Controllers.DbEntity
{
    [ApiController]
	[Route("[controller]")]
	public class KeyController : EntityController<Key>
	{
		private NoteRepository _noteRepo;
		private Lazy<IRepository<Key>> _keyRepo;

		public KeyController(IRepository<Key> repository, IRepository<Note> noteRepository)
			: base(repository)
		{
			_keyRepo = new Lazy<IRepository<Key>>(repository);
			_noteRepo = (NoteRepository)noteRepository;
		}

		// TODO: This really should just be get
		[HttpPost("locate")]
		public virtual async Task<ActionResult<Key>> Locate(LocateKeyArgs args)
		{
			var note = new Note(args.Base, args.Suffix);

			var noteResult = await _noteRepo.GetOrCreate(note);
			if (!noteResult.Success)
			{
				return BadRequest(new Response<Note>(noteResult));
			}

			var key = new Key(noteResult.Result, args.Type);
			var keyResult = await _keyRepo.Value.GetOrCreate(key);

			if (!keyResult.Success)
			{
				return BadRequest(new Response<Key>(keyResult));
			}

			return Ok(keyResult.Result);
		}
	}

	public class LocateKeyArgs
	{
		public KeyType Type;
		public NoteValue Base;
		public NoteSuffix Suffix;
	}
}