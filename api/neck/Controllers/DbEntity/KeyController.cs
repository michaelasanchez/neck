using Microsoft.AspNetCore.Mvc;
using neck.Enums;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Args;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Controllers.DbEntity
{
	[ApiController]
	[Route("[controller]")]
	public class KeyController : EntityController<Key>
	{
		private Lazy<IRepository<Note>> _noteRepo;
		private Lazy<IRepository<Key>> _keyRepo;

		private Lazy<IKeyService> _keyService;

		public KeyController(IRepository<Key> repository, IRepository<Note> noteRepository, IKeyService keyService)
			: base(repository)
		{
			_keyRepo = new Lazy<IRepository<Key>>(repository);
			_noteRepo = new Lazy<IRepository<Note>>(noteRepository);

			_keyService = new Lazy<IKeyService>(keyService);
		}

		[HttpPost("locate")]
		public virtual async Task<ActionResult<Key>> Locate(LocateKeyArgs args)
		{
			var note = new Note(args.Base, args.Suffix);

			var noteResult = await _noteRepo.Value.Locate(note);
			if (!noteResult.Success)
			{
				return BadRequest(new Response<Note>(noteResult));
			}

			var key = new Key(noteResult.Result, args.Type);
			var keyResult = await _keyRepo.Value.Locate(key);

			if (!keyResult.Success)
			{
				return BadRequest(new Response<Key>(keyResult));
			}

			return Ok(keyResult.Result);
		}

		[HttpPost("search")]
		public virtual async Task<ActionResult<List<Key>>> Search(KeySearchArgs args)
        {
			var keyResult = await _keyService.Value.Search(args);
			if (!keyResult.Success)
			{
				return BadRequest(new Response<List<Key>>(keyResult));
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