using neck.Interfaces;
using neck.Models;
using neck.Models.Results;
using System;

namespace neck.Factories.Args
{
	public class ChordVariationCreateArgs
	{
		public Guid? chordId;
		public Guid? tuningId;

		public Chord chord;
		public Tuning tuning;
	}
}
