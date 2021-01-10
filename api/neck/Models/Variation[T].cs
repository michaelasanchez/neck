using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

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

		//protected Variation(Tuning tuning, string label = null)
		//{
		//	if (tuning != null)
		//	{
		//		Tuning = tuning;

		//		if (tuning?.Id != null)
		//		{
		//			TuningId = tuning.Id;
		//		}
		//	}
		//}
	}
}
