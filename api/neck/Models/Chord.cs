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

		//	MAJOR
		//
		//  C           D           E     F           G           A           B   
		//        C#/Db       D#/Eb             F#/Gb       G#/Ab       A#/Bb
		//  B#                      Fb    E#                                  Cb
		//  0     1     2     3     4     5     6     7     8     9     10    11 

		//	MINOR
		//
		//	

		// I        tonic
		// ii       supertonic
		// iii      mediant
		// IV       subdominant
		// V        dominant
		// vi	      submediant
		// viio     leading tone (#)
		//            / subtonic (b)
		//  / ♭VII

		//  I   ii  iii IV  V   vi  viio
		//  ----------------------------
		//  C   Dm  Em  F   G   Am  Bdim

		private List<int> getDegrees(ChordModifier mod)
		{
			// TODO: Currently exist on front end
			switch (mod)
			{
				case ChordModifier.Major:
					return new List<int> { 0, 2, 4 };
				case ChordModifier.Minor:
					return new List<int> { 0, 2, 4 };
				case ChordModifier.Diminished:
					throw new Exception("Not implemented");
				case ChordModifier.MajorSeventh:
					return new List<int> { 0, 2, 4, 6 };
				case ChordModifier.MinorSeventh:
					return new List<int> { 0, 2, 4, 6 };
				case ChordModifier.DominantSeventh:
					throw new Exception("Not implemented");
				case ChordModifier.Suspended:
					throw new Exception("Not implemented");
				case ChordModifier.Augmented:
					return new List<int> { 0, 2, 4 };
				default:
					return null;
			}
		}

		private List<Note> mapComponents(Note root, ChordModifier mod)
		{

			// Degress mark a note's position in a scale
			var degrees = getDegrees(mod);

			var scale = mod == ChordModifier.Minor || mod == ChordModifier.MinorSeventh
				? new Scale(root, Mode.Aeolian())
				: new Scale(root, Mode.Ionian());
			
			// Components are the notes that compose a chord
			var components = degrees
				.Select(d => scale.Notes.FirstOrDefault(n => n.Degree == d))
				.ToList();

			switch (mod)
			{
				case ChordModifier.Augmented:
					var fifth = components.Last();
					var index = components.IndexOf(fifth);
					components[index] = fifth.HalfStepUp();
					break;
				case ChordModifier.Diminished:
					break;
			}

			return components;
		}

	}
}
