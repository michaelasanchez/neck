using neck.Models.Entity;

namespace neck.Interfaces
{
	public interface IVariation<T> : IDbEntity, ILabelled
	{
		Tuning Tuning { get; set; }

		T Base { get; set; }
	}
}
