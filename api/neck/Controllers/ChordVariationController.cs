using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Generators;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace neck.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ChordVariationController : GenericController<ChordVariation>
	{
		private readonly ILogger<ChordVariationController> _logger;

		private readonly IGenerator<ChordVariation> _generator;

		private IRepository<Formation> _formationRepo;
		private IRepository<Note> _noteRepo;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			IGenerator<ChordVariation> generator,
			IRepository<Formation> formationRepository,
			IRepository<Note> noteRepository
		)
			: base(repository)
		{
			_logger = logger;
			_generator = generator;

			_formationRepo = formationRepository;
			_noteRepo = noteRepository;
		}

		public override Task<IActionResult> Insert(ChordVariation variation)
		{
			if (variation.Formation != null)
			{
				var formation = _formationRepo.FirstOrDefault(f => f.Hash == variation.Formation.Hash);
				if (formation != null)
				{
					variation.Formation.Id = formation.Id;
				}
			}

			var chord = variation.Chord;
			if (chord != null)
			{
				var note = _noteRepo.FirstOrDefault(n => n.Base == chord.Root.Base && n.Suffix == chord.Root.Suffix);
				if (note != null)
				{
					chord.Root = note;
				}
			}

			return base.Insert(variation);
		}

		[HttpPost("{controller}/generate")]
		public List<ChordVariation> Generate([FromBody] ChordVariationGetParams getParams)
		{
			if (getParams.chord == null || getParams.tuning == null)
			{
				return new List<ChordVariation>();
			}

			var offset = getParams.offset ?? 0;
			var span = getParams.span ?? 4;

			return ((ChordVariationGenerator)_generator).GenerateInRange(getParams.chord, getParams.tuning, offset, span);
		}
	}

	public class ChordVariationGetParams
	{
		public Chord chord;
		public Tuning tuning;
		public int? offset;
		public int? span;
	}
}
