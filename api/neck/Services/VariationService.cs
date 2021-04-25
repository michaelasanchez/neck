using Microsoft.Extensions.Logging;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace neck.Services
{
	public abstract class VariationService<TBase, TVariation>
		where TBase : IDbEntity
		where TVariation : IVariation<TBase>
	{
		private readonly ILogger<VariationService<TBase, TVariation>> _logger;

		protected IRepository<TBase> _baseRepo { get; set; }
		protected IRepository<Tuning> _tuningRepo { get; set; }

		public VariationService(
			ILogger<VariationService<TBase, TVariation>> logger,
			IRepository<TBase> baseRepository,
			IRepository<Tuning> tuningRepository
			)
		{
			_logger = logger;

			_baseRepo = baseRepository;
			_tuningRepo = tuningRepository;
		}

		protected abstract Task<OperationResult<List<Key>>> GetKeys(TBase @base);

		protected OperationResult<GenerateResponseHeader<TVariation>> CreateFailure(IOperationResult result)
		{
			return OperationResult<GenerateResponseHeader<TVariation>>.CreateFailure(result.Message);
		}
	}
}
