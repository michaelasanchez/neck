using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
	interface IVariation<T>
	{
		string Label { get; set; }

		Guid TuningId { get; set; }

		T Base { get; set; }
	}
}
