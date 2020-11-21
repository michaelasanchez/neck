using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Comparers
{
	public class PositionsComparer
	{
		public static ValueComparer Compare = new ValueComparer<IList<int?>>(
			(l1, l2) => l1.SequenceEqual(l2),
			l => l.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
			l => (IList<int?>)l.ToHashSet());

		public static ValueComparer CompareIgnoringNull = new ValueComparer<IList<int?>>(
			(l1, l2) => l1.SequenceEqual(l2),
			l => l,
			l => l);
	}
}
