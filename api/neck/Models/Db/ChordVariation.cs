using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Db
{
    public class ChordVariation : DbEntity
    {
        private List<int?> _positions;
        private List<int?> _barre;

        // private _chordForm: ChordForm;

        private ChordVariation() { }

        public ChordVariation(List<int?> positions, Chord chord, Tuning tuning, bool convert = false)
        {
            _positions = positions;
        }

        public string Label { get; set; }

        public List<int?> Positions {
            get => _positions;
            set {
                _positions = value;

                // TODO:
                // If we are setting positions manually
                //  should we assume barre will be set or
                //  need to be cleared?
                //_barre = clearBarre(_positions);
            }
        }

        public List<int?> Barre {
            get => _barre;
            set => _barre = value;
        }

        private List<int?> clearBarre(List<int?> positions)
        {
            return Enumerable.Repeat<int?>(null, positions.Count).ToList();
        }
    }
}
