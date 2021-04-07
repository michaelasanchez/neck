using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Args;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Services.Interfaces
{
    public interface IKeyService
    {
        Task<OperationResult<Key>> Locate(KeyLocateArgs args);

        Task<OperationResult<List<Key>>> Search(KeySearchArgs args);
    }
}
