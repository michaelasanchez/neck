using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
	public abstract class Variation<T> : DbEntity, IVariation<T>
	{
		public string Label { get; set; }

		public Guid TuningId { get; set; }

		public Tuning Tuning { get; set; }

		[NotMapped]
		public T Base { get; set; }
	}
}
