using neck.Controllers.Args;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Services.Interfaces
{
	public interface IVariationService<TBase, TVariation>
	{
		public Task<OperationResult<GenerateResponseHeader<TVariation>>> Generate(Guid baseId, Guid tuningId, int offset, int span);
		
		public Task<OperationResult<GenerateResponseHeader<TVariation>>> GenerateRange(Guid baseId, Guid tuningId, int offset, int range, int span);
	}
}
