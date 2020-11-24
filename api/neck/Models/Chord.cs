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
        public Note Root { get; set; }
        public ChordModifier Modifier { get; set; }

        public string Label => $"{Root?.Label} {Modifier}";

        [NotMapped]
        public List<Key> Keys => _keys;

        [NotMapped]
        public List<Note> Components => _components;

        private List<Key> _keys;
        private List<Note> _components;

        public Chord() { }

        public Chord(Note root, ChordModifier mod)
        {
            Root = root;
            Modifier = mod;

            _keys = new List<Key>
            {
                new Key(Root, Modifier == ChordModifier.Major ? KeyType.Major : KeyType.Minor)
            };

            var scale = Modifier == ChordModifier.Major
                ? new Scale(Root, Mode.Ionian())
                : new Scale(Root, Mode.Aeolian());

            _components = calculateComponents(scale, Modifier);
        }

        private List<int> getDegrees(ChordModifier mod) {
            switch (mod) {
                case ChordModifier.Major:
                    return new List<int> { 0, 2, 4 };
                case ChordModifier.Minor:
                    return new List<int> { 0, 2, 3 };
                default:
                    return null;
            }
        }

        private List<Note> calculateComponents(Scale scale, ChordModifier mod)
        {
            return getDegrees(mod)
                .Select(d => scale.Notes.FirstOrDefault(n => n.Degree == d))
                .ToList();
        }

    }
}
