using Microsoft.AspNetCore.Mvc;
using neck.Enums;
using neck.Interfaces;
using neck.Models;
using neck.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static neck.Enums.ChordEnums;

namespace neck.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ChordController : GenericController<Chord>
	{
		private NoteRepository _noteRepo;
		private Lazy<IRepository<Chord>> _chordRepo;

		public ChordController(IRepository<Chord> repository, IRepository<Note> noteRepository)
			: base(repository)
		{
			_chordRepo = new Lazy<IRepository<Chord>>(repository);
			_noteRepo = (NoteRepository)noteRepository;
		}

		[HttpPost("quick")]
		public virtual async Task<ActionResult<Chord>> QuickChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier)
		{
			var note = new Note(value, suffix);

			var noteResult = await _noteRepo.GetOrCreate(note);
			if (!noteResult.Success)
			{
				return BadRequest("Failed to get create note");
			}

			var chord = new Chord(noteResult.Result, modifier);
			var chordResult = await _chordRepo.Value.GetOrCreate(chord);
			if (!chordResult.Success)
			{
				return BadRequest("Failed to create chord");
			}

			return Ok(chordResult.Result);
		}
	}
}
