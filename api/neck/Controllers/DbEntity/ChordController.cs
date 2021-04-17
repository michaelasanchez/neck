using Microsoft.AspNetCore.Mvc;
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
	public class ChordController : EntityController<Chord>
	{
		private Lazy<IRepository<Note>> _noteRepo;
		private Lazy<IRepository<Chord>> _chordRepo;

		public ChordController(IRepository<Chord> repository, IRepository<Note> noteRepository)
			: base(repository)
		{
			_chordRepo = new Lazy<IRepository<Chord>>(repository);
			_noteRepo = new Lazy<IRepository<Note>>(noteRepository);
		}

		// TODO: This really should just be get
		[HttpPost("byvalues")]
		public virtual async Task<ActionResult<Chord>> GetByValues(QuickChordArgs @params)
		{
			var note = new Note(@params.value, @params.suffix);

			var noteResult = await _noteRepo.Value.Locate(note);
			if (!noteResult.Success)
			{
				return BadRequest(new Response<Note>(noteResult));
			}

			var chord = new Chord(noteResult.Result, @params.modifier);
			var chordResult = await _chordRepo.Value.Locate(chord);

			if (!chordResult.Success)
			{
				return BadRequest(new Response<Chord>(chordResult));
			}

			return Ok(chordResult.Result);
		}
	}

	public class QuickChordArgs
	{
		public NoteValue value;
		public NoteSuffix suffix;
		public ChordModifier modifier;
	}

}