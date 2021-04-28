using neck.Factories.Interfaces;

namespace neck.Factories.Options
{
	public class ChordVariationGenerateOptions
	{
		public bool EnforceTones { get; set; }

		public bool FilterInversions { get; set; }

		public bool InsertOpen { get; set; }

		public bool InsertFirstMuted { get; set; }

		public bool InsertMuted { get; set; }
	}
}
