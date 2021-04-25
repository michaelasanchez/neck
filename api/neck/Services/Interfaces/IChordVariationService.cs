using neck.Factories.Options;
using neck.Models.Entity.Variations;
using neck.Models.Results;
using System;
using System.Threading.Tasks;

namespace neck.Services.Interfaces
{
	public interface IChordVariationService
	{
		public Task<OperationResult<GenerateResponseHeader<ChordVariation>>> Generate(Guid baseId, Guid tuningId, int offset, int span, ChordVariationGenerateOptions options);
		
		public Task<OperationResult<GenerateResponseHeader<ChordVariation>>> GenerateRange(Guid baseId, Guid tuningId, int offset, int range, int span, ChordVariationGenerateOptions options);
	}
}
