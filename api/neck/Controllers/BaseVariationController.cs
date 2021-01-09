using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers
{
	public class BaseVariationController<TVariation> : GenericController<TVariation>
	{
		private readonly ILogger<BaseVariationController<TVariation>> _logger;

		private IFactory<TVariation> _factory;

		private IRepository<Chord> _chordRepo;
		private IRepository<Tuning> _tuningRepo;

		public BaseVariationController(
			ILogger<BaseVariationController<TVariation>> logger,
			IRepository<TVariation> repository,
			IFactory<TVariation> factory,
			IRepository<Tuning> tuningRepository
		)
			: base(repository)
		{
			_logger = logger;
			_factory = factory;

			_tuningRepo = tuningRepository;
		}
	}
}