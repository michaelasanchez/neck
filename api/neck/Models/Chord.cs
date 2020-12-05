using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using static neck.Enums.ChordEnums;

namespace neck.Models
{
	public class Chord : DbEntity
	{
		private List<Key> _keys;
		private List<Note> _tones;

		public Guid RootId { get; set; }
		public Note Root { get; set; }

		public ChordModifier Modifier { get; set; }

		public string Label => $"{Root?.Label} {Modifier}";

		[NotMapped]
		public List<Key> Keys => _keys;

		[NotMapped]
		public List<Note> Tones
		{
			get
			{
				if (_tones == null && Root != null)
				{
					_tones = mapComponents(Root, Modifier);
				}

				return _tones;
			}
		}

		public Chord() { }

		public Chord(Note root, ChordModifier modifier)
		{
			Root = root;
			Modifier = modifier;

			_keys = new List<Key>
			{
				new Key(Root, Modifier == ChordModifier.Minor ? KeyType.Minor : KeyType.Major)
			};

			_tones = mapComponents(Root, Modifier);
		}

		private List<int> getDegrees(ChordModifier mod)
		{
			switch (mod)
			{
				case ChordModifier.Major:
					return new List<int> { 0, 2, 4 };
				case ChordModifier.Minor:
					return new List<int> { 0, 2, 4 };
				case ChordModifier.MajorSeventh:
					return new List<int> { 0, 2, 4, 6 };
				default:
					return null;
			}
		}

		private List<Note> mapComponents(Note root, ChordModifier mod)
		{
			var scale = mod == ChordModifier.Minor
				? new Scale(root, Mode.Aeolian())
				: new Scale(root, Mode.Ionian());

			var degrees = getDegrees(mod);

			return degrees
				.Select(d => scale.Notes.FirstOrDefault(n => n.Degree == d))
				.ToList();
		}

	}
}
