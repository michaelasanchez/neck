using Microsoft.AspNetCore.Mvc;
using neck.Enums;
using neck.Interfaces;
using neck.Models;
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
		public ChordController(IRepository<Chord> repository)
			: base(repository)
		{
		}

		[HttpPost("quick")]
		public virtual async Task<ActionResult<Chord>> QuickChord(NoteValue value, NoteSuffix suffix, ChordModifier modifier)
		{
			return new Chord(new Note(value, suffix), modifier);
		}
	}
}
