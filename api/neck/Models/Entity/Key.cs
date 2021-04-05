using neck.Interfaces;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace neck.Models.Entity
{
    public enum KeyType
    {
        Major,
        Minor
    }

    public class Key : DbEntity, ILabelled
    {
        private Scale _scale;

        public KeyType Type { get; set; }

        public Guid TonicId { get; set; }

        public Note Tonic { get; set; }

        [NotMapped]
        public Scale Scale
        {
            get
            {
                if (_scale == null && Tonic != null)
                {
                    _scale = new Scale(Tonic, Type);
                }
                return _scale;
            }
        }

        public Key() { }

        public Key(Note tonic, KeyType type)
        {
            Tonic = tonic;
            Type = type;
        }

        public string Label => $"Key of {Tonic.Label}";
    }
}
