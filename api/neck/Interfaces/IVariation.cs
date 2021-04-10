using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
    public interface IVariation<T> : IDbEntity, ILabelled
	{
		Tuning Tuning { get; set; }

		T Base { get; set; }
	}
}
