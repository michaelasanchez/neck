using neck.Factories.Options;
using neck.Models.Entity.Variations;
using neck.Models.Results;
using System;
using System.Threading.Tasks;

namespace neck.Services.Interfaces
{
	public interface IScaleVariationService
	{
		public Task<OperationResult<GenerateResponseHeader<ScaleVariation>>> Generate(Guid baseId, Guid tuningId, int offset, int range, int span, ScaleVariationGenerateOptions options);
	}
}
