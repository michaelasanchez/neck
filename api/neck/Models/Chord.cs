using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static neck.Enums.ChordEnums;

namespace neck.Models
{
    public class Chord
    {
        private Note _root;
        private ChordModifier _modifier;

        private List<Key> _keys;
        private List<Note> _components;

        public Chord(Note root, ChordModifier mod)
        {
            _root = root;
            _modifier = mod;

            _keys = new List<Key>
            {
                new Key(_root, _modifier == ChordModifier.Major ? KeyType.Major : KeyType.Minor)
            };

            var scale = _modifier == ChordModifier.Major
                ? new Scale(_root, Mode.Ionian())
                : new Scale(_root, Mode.Aeolian());

            _components = calculateComponents(scale, _modifier);
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

        public List<Key> Keys => _keys;

        public List<Note> Components => _components;
    }
}
