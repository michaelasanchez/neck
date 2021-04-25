using Microsoft.AspNetCore.Mvc;
using neck.Enums;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Repositories;
using System;
using System.Threading.Tasks;

namespace neck.Controllers.DbEntity
{
    [ApiController]
	[Route("[controller]")]
	public class ScaleController : EntityController<Scale>
	{
		// TODO: Replace this with note locator
		private Lazy<IRepository<Note>> _noteRepo;
		private Lazy<IRepository<Scale>> _scaleRepo;

		public ScaleController(IRepository<Scale> repository, IRepository<Note> noteRepository)
			: base(repository)
		{
			_scaleRepo = new Lazy<IRepository<Scale>>(repository);
			_noteRepo = new Lazy<IRepository<Note>>(noteRepository);
		}

		[HttpPost("byvalues")]
		public virtual async Task<ActionResult<Scale>> GetByValues(QuickScaleArgs @params)
		{
			var note = new Note(@params.value, @params.suffix);

			var noteResult = await _noteRepo.Value.Locate(note);
			if (!noteResult.Success)
			{
				return BadRequest(new Response<Note>(noteResult));
			}

			var scale = new Scale(noteResult.Result, @params.type);
			var scaleResult = await _scaleRepo.Value.Locate(scale);

			if (!scaleResult.Success)
			{
				return BadRequest(new Response<Scale>(scaleResult));
			}

			return Ok(scaleResult.Result);
		}
	}

	public class QuickScaleArgs
	{
		public NoteValue value { get; set; }
		public NoteSuffix suffix { get; set; }
		public ScaleType type { get; set; }
	}

}