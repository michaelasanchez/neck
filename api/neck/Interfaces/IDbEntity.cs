using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    public interface IDbEntity : IDatedEntity
    {
        Guid Id { get; set; }
    }
}
