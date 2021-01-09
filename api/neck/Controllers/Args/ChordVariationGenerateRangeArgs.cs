using neck.Interfaces;
using neck.Models;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Controllers.Args
{
	public class ChordVariationGenerateArgs
	{
		public const int DefaultOffset = 0;
		public const int DefaultSpan = 4;

		public Guid? chordId;
		public Guid? tuningId;
		public Chord chord;
		public Tuning tuning;
		public int? offset;
		public int? span;

		public virtual IOperationResult Validate()
		{
			if (chord == null && chordId == null)
			{
				return OperationResult.CreateFailure("Chord or chordId is required");
			}
			else if (chord.Root == null)
			{
				return OperationResult.CreateFailure("Chord missing root note");
			}

			if (tuning == null && tuningId == null)
			{
				return OperationResult.CreateFailure("Tuning or tuningId is required");
			}

			offset = offset == null || offset < DefaultOffset ? 0 : offset;
			span = span == null || span < 1 ? DefaultSpan : span;

			return OperationResult.CreateSuccess();
		}
	}
}
