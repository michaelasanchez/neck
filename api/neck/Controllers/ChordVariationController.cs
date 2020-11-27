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
		private IRepository<Tuning> _tuningRepo;

		public ChordVariationController(
			ILogger<ChordVariationController> logger,
			IRepository<ChordVariation> repository,
			IGenerator<ChordVariation> generator,
			IRepository<Chord> chordRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(repository)
		{
			_logger = logger;
			_generator = generator;

			_chordRepo = chordRepository;
			_tuningRepo = tuningRepository;
		}

		[HttpPost]
		[Route("generate")]
		public async Task<List<ChordVariation>> Generate([FromBody] ChordVariationGenerateParams @params)
		{
			if ((@params.chordId == null && @params.chord == null) ||
				(@params.tuningId == null && @params.tuning == null))
			{
				return new List<ChordVariation>();
			}

			var chord = @params.chord ?? await _chordRepo.GetAsync(@params.chordId);
			var tuning = @params.tuning ?? await _tuningRepo.GetAsync(@params.tuningId);

			var offset = @params.offset ?? 0;
			var span = @params.span ?? 4;

			ChordVariationGenerator yeah = (ChordVariationGenerator)_generator;
			var uhh = ((ChordVariationGenerator)_generator).GenerateVariations(chord, tuning, offset, span);


			return uhh;
		}

		[HttpPost]
		[Route("generaterange")]
		public async Task<List<ChordVariation>> GenerateRange([FromBody] ChordVariationGenerateParams @params)
		{
			if ((@params.chordId == null && @params.chord == null) ||
				(@params.tuningId == null && @params.tuning == null))
			{
				return new List<ChordVariation>();
			}

			var chord = @params.chord ?? await _chordRepo.GetAsync(@params.chordId);
			var tuning = @params.tuning ?? await _tuningRepo.GetAsync(@params.tuningId);

			var offset = @params.offset ?? 0;
			var span = @params.span ?? 4;

			ChordVariationGenerator yeah = (ChordVariationGenerator)_generator;
			var uhh = ((ChordVariationGenerator)_generator).GenerateRange(chord, tuning, offset, 14, span);


			return uhh;
		}
	}

	public class ChordVariationGenerateParams
	{
		public Guid? chordId;
		public Guid? tuningId;
		public Chord chord;
		public Tuning tuning;
		public int? offset;
		public int? span;
	}
}
