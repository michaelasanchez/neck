using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Converters
{
	public class PositionsConverter
	{
		// Converts list of neck positions to csv
		public static string ListToString(List<int> p) =>
			string.Join(",", p.Select(n => n.ToString()));

		// Converts list of nullable neck positions to csv
		public static string ListToString(List<int?> p) =>
			string.Join(",", p.Select(n => n == null ? "null" : n.ToString()));

		// Converts neck positions csv to list
		public static List<int> StringToList(string p, int defaultValue = 0) =>
			p.Split(',', StringSplitOptions.None)
				.Select(n => Int32.TryParse(n, out int value) ? value : defaultValue)
				.ToList();

		// Converts nullable positions csv to nullable positions list
		public static List<int?> StringToNullableList(string p) =>
			p.Split(',', StringSplitOptions.None)
				.Select(n => n == "null" ? null : (int?)Convert.ToInt32(n))
				.ToList();
	}
}
