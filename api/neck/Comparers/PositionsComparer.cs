using Microsoft.EntityFrameworkCore.ChangeTracking;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Comparers
{
	public class PositionsComparer
	{
		public static ValueComparer Compare = new ValueComparer<List<Note>>(
			(l1, l2) => l1.SequenceEqual(l2),
			l => l.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
			l => l.ToHashSet().ToList());

		public static ValueComparer CompareNullable = new ValueComparer<List<int?>>(
			(l1, l2) => l1.SequenceEqual(l2),
			l => l.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
			l => l.ToHashSet().ToList());
	}
}