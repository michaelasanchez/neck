using neck.Interfaces;
using IntervalType = neck.Enums.Interval;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Intervals
{
	public class Interval// : IInterval<IntervalType>
	{
		//public IntervalType Value { get; set; }

		//public Interval() { }

		//public Interval(IntervalType value)
		//{
		//	Value = value;
		//}

		public static int Root => 0;

		//public static int PerfectUnison => 0;

		public static int MinorSecond => 1;

		public static int MajorSecond => 2;

		public static int MinorThird => 3;

		public static int MajorThird => 4;

		public static int PerfectFourth => 5;

		public static int DiminishedFifth => 6;

		public static int AugmentedFourth => 6;

		public static int PerfectFifth => 7;

		public static int MinorSixth => 8;

		public static int MajorSixth => 9;

		public static int MinorSeventh => 10;

		public static int MajorSeventh => 11;

		public static int PerfectOctave => 12;
	}
}
