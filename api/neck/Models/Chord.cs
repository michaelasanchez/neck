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

		public Guid RootId { get; set; }
		public Note Root { get; set; }

		public ChordModifier Modifier { get; set; }

		public string Label => $"{Root?.Label} {Modifier}";

		[NotMapped]
		public List<Key> Keys => _keys;

		[NotMapped]
		public List<Note> Components
		{
			get
			{
				if (_components == null && Root != null)
				{
					_components = mapComponents(Root, Modifier);
				}

				return _components;
			}
		}

		private List<Key> _keys;
		private List<Note> _components;

		public Chord() { }

		public Chord(Note root, ChordModifier modifier)
		{
			Root = root;
			Modifier = modifier;

			_keys = new List<Key>
			{
				new Key(Root, Modifier == ChordModifier.Minor ? KeyType.Minor : KeyType.Major)
			};

			_components = mapComponents(Root, Modifier);
		}

		private List<int> getDegrees(ChordModifier mod)
		{
			switch (mod)
			{
				case ChordModifier.Major:
					return new List<int> { 0, 2, 4 };
				case ChordModifier.Minor:
					return new List<int> { 0, 2, 3 };
				default:
					return null;
			}
		}

		private List<Note> mapComponents(Note root, ChordModifier mod)
		{
			var scale = mod== ChordModifier.Major
				? new Scale(root, Mode.Ionian())
				: new Scale(root, Mode.Aeolian());

			return getDegrees(mod)
				.Select(d => scale.Notes.FirstOrDefault(n => n.Degree == d))
				.ToList();
		}

	}
}
