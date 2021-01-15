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
	public class ScaleController : GenericController<Scale>
	{
		// TODO: Replace this with note locator
		private NoteRepository _noteRepo;
		private Lazy<IRepository<Scale>> _scaleRepo;

		public ScaleController(IRepository<Scale> repository, IRepository<Note> noteRepository)
			: base(repository)
		{
			_scaleRepo = new Lazy<IRepository<Scale>>(repository);
			_noteRepo = (NoteRepository)noteRepository;
		}

		[HttpPost("byvalues")]
		public virtual async Task<ActionResult<Scale>> GetByValues(QuickScaleArgs @params)
		{
			var note = new Note(@params.value, @params.suffix);

			var noteResult = await _noteRepo.GetOrCreate(note);
			if (!noteResult.Success)
			{
				return BadRequest("Failed to get create note");
			}

			var scale = new Scale(noteResult.Result, @params.type);
			var scaleResult = await _scaleRepo.Value.GetOrCreate(scale);

			if (!scaleResult.Success)
			{
				return BadRequest("Failed to create chord");
			}

			return Ok(scaleResult.Result);
		}
	}

	public class QuickScaleArgs
	{
		public NoteValue value;
		public NoteSuffix suffix;
		public ScaleType type;
	}

}