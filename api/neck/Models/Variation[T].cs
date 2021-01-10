using neck.Interfaces;
using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace neck.Models
{
	public abstract class Variation<T> : DbEntity, IVariation<T>
		where T : ILabelled
	{
		[NotMapped]
		public string Label => $"{Base?.Label} Variation";

		public Guid TuningId { get; set; }

		[JsonIgnore]
		public Tuning Tuning { get; set; }

		[NotMapped]
		[JsonIgnore]
		public T Base { get; set; }
	}
}
