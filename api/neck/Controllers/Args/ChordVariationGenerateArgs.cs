using neck.Interfaces;
using neck.Models.Entity;

namespace neck.Controllers.Args
{
	public class ChordVariationGenerateArgs : VariationGenerateArgs<Chord>
	{
		private static bool _defaultEnforceTones = true;
		private static bool _defaultFilterInversions = true;
		private static bool _defaultInsertOpen = true;
		private static bool _defaultInsertMuted = true;

		public bool? EnforceTones { get; set; }

		public bool? FilterInversions { get; set; }

		public bool? InsertOpen { get; set; }

		public bool? InsertMuted { get; set; }

		public override IOperationResult Validate()
		{
			EnforceTones = EnforceTones == null ? _defaultEnforceTones : EnforceTones;
			FilterInversions = FilterInversions == null ? _defaultFilterInversions : FilterInversions;
			InsertOpen = InsertOpen == null ? _defaultInsertOpen : InsertOpen;
			InsertMuted = InsertMuted == null ? _defaultInsertMuted : InsertMuted;

			return base.Validate();
		}
	}
}
