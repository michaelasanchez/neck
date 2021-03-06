﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    public interface IDatedEntity
    {
        DateTimeOffset Created { get; set; }
        DateTimeOffset? Updated { get; set; }
    }
}
