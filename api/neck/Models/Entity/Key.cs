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


        //public Guid ScaleId { get; set; }

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

        public Key(Note tonic, KeyType type = KeyType.Major)
        {
            Tonic = tonic;
            TonicId = tonic.Id;
            Type = type;
        }

        public string Label => getLabel();

        private string getLabel(bool longLabel = false)
        {
            var typeString = string.Empty;
            switch(Type)
            {
                case KeyType.Major:
                    typeString = longLabel ? " Major" : "";
                    break;
                case KeyType.Minor:
                    typeString = " Minor";
                    break;
            }
            return $"Key of {Tonic.Label}{typeString}";
        }
    }
}
