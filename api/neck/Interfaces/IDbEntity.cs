using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    interface IDbEntity : IDatedEntity
    {
        Guid Id { get; set; }
    }
}
