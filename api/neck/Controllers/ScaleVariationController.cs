using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Factories;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Controllers
{

	[ApiController]
	[Route("[controller]")]
	public class ScaleVariationController : VariationController<Scale, ScaleVariation>
	{
		private readonly ILogger<ScaleVariationController> _logger;

		private IVariationFactory<Scale, ScaleVariation> _factory;

		private IRepository<Scale> _baseRepo;
		private IRepository<Tuning> _tuningRepo;

		public ScaleVariationController(
			ILogger<ScaleVariationController> logger,
			IVariationFactory<Scale, ScaleVariation> factory,
			IRepository<ScaleVariation> repository,
			IRepository<Scale> baseRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(logger, factory, repository, baseRepository, tuningRepository)
		{
			_logger = logger;
			_factory = factory;

			_baseRepo = baseRepository;
			_tuningRepo = tuningRepository;
		}

		[HttpPost("Test")]
		public async Task<ActionResult<List<ChordVariation>>> Test(/*[FromBody] ChordVariationGenerateParams @params*/)
		{
			Tuning tuning = null; // = @params.tuning;
			if (tuning == null)
			{
				var result = await _tuningRepo.GetById(new Guid("F8EBD6AE-B39F-4C4F-8CEB-94D3DE160A0B")/*@params.tuningId*/);
				if (result.Success)
				{
					tuning = result.Result;
				}
			}

			var note = new Note(Enums.NoteValue.C, Enums.NoteSuffix.Natural);
			var scale = new Scale(note, Enums.ScaleType.Diatonic);

			return Ok(_factory.GenerateVariations(scale, tuning, 3, 5));
		}
	}
}
