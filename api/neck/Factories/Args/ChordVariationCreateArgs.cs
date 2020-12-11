﻿using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Factories.Args
{
	public class ChordVariationCreateArgs
	{
		public Chord chord;
		public Tuning tuning;
		public int fretOffset;
		public int fretSpan;
	}
}
