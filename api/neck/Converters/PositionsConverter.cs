using neck.Enums;
using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace neck.Converters
{
	public class PositionsConverter
	{
		private const char NoteDelimiter = ',';
		private const char ValueDelimiter = ' ';

		// Converts list of neck positions to delimited string
		public static string ListToString(List<Note> p) =>
			string.Join(NoteDelimiter, p.Select(n => $"({(int)n.Base}{ValueDelimiter}{(int)n.Suffix}{ValueDelimiter}{n.Octave})"));

		// TODO: Look into doing this non-manually
		// Converts delimited positions string to list of notes
		public static List<Note> StringToList(string p, int defaultValue = 0)
		{
			var notes = new List<Note>();

			foreach (var noteString in p.Split(NoteDelimiter, StringSplitOptions.None))
			{
				var noteArray = noteString.Split(ValueDelimiter);
				var values = noteArray
					.Select(v => Int32.Parse(Regex.Replace(v, "[^0-9]", "")))
					.ToList();
				notes.Add(new Note((NoteValue)values[0], (NoteSuffix)values[1], values[2]));
			}

			return notes;
		}

		// Converts list of nullable neck positions to csv
		public static string ListToString(List<int?> p) =>
			string.Join(",", p.Select(n => n == null ? "null" : n.ToString()));

		// Converts nullable positions csv to nullable positions list
		public static List<int?> StringToNullableList(string p) =>
			p.Split(',', StringSplitOptions.None)
				.Select(n => n == "null" ? null : (int?)Convert.ToInt32(n))
				.ToList();
	}
}
