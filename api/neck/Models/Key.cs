using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
    public enum KeyType
    {
        Major,
        Minor
    }

    public class Key
    {
        Note _tonic;

        KeyType _type;

        public Key(Note tonic, KeyType type = KeyType.Major)
        {
            _tonic = tonic;
            _type = type;
        }

        public string Label => $"Key of {_tonic.Label}";

        public Note Tonic => _tonic;

        public KeyType Type => _type;
    }
}
