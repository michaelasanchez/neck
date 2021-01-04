using Microsoft.AspNetCore.Mvc;
using neck.Factories;
using neck.Factories.Args;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class ScaleVariationController : GenericController<ScaleVariation>
	{
		private IRepository<Tuning> _tuningRepo;
		private ScaleVariationFactory _factory;

		public ScaleVariationController(
			IRepository<ScaleVariation> repository,
			IRepository<Tuning> tuningRepo,
			IFactory<ScaleVariation, ScaleVariationCreateArgs> factory)
			: base(repository)
		{
			_tuningRepo = tuningRepo;
			_factory = (ScaleVariationFactory)factory;
		}

		[HttpPost("Generate")]
		public async Task<ActionResult<List<ChordVariation>>> Generate(/*[FromBody] ChordVariationGenerateParams @params*/)
		{
			Tuning tuning = null; // = @params.tuning;
			if (tuning == null)
			{
				var result = await _tuningRepo.GetById(new Guid("6ED19AC7-49DF-47E3-ABB5-80ED7F6EB600")/*@params.tuningId*/);
				if (result.Success)
				{
					tuning = result.Result;
				}
			}

			var note = new Note(Enums.NoteValue.C, Enums.NoteSuffix.Natural);
			var scale = new Scale(note, Enums.ScaleType.Diatonic);

			return Ok(_factory.GenerateVariations(scale, tuning, 0, 6));
		}
	}
}
