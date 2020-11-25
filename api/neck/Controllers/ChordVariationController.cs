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

		private IRepository<Chord> _chordRepo;
		private IRepository<Formation> _formationRepo;
		private IRepository<Note> _noteRepo;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			IGenerator<ChordVariation> generator,
			IRepository<Chord> chordRepository,
			IRepository<Formation> formationRepository,
			IRepository<Note> noteRepository
		)
			: base(repository)
		{
			_logger = logger;
			_generator = generator;

			_chordRepo = chordRepository;
			_formationRepo = formationRepository;
			_noteRepo = noteRepository;
		}

		public async override Task<IActionResult> Insert(ChordVariation variation)
		{
			if (variation.Formation != null)
			{
				var formation = await _formationRepo.Exists(variation.Formation);
				if (formation != null)
				{
					variation.Formation = formation;
				}
			}

			if (variation?.Chord?.Root != null)
			{
				var chord = await _chordRepo.Exists(variation.Chord);
				if (chord != null)
				{
					variation.Chord = chord;
				}
			}

			return await base.Insert(variation);
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
