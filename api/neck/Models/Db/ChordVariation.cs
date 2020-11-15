using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Db
{
    public class ChordVariation
    {
        private List<int?> _positions;
        private List<int?> _barre;

        // private _chordForm: ChordForm;

        private ChordVariation() { }

        public ChordVariation(List<int?> positions, Chord chord, Tuning tuning, bool convert = false)
        {
            _positions = positions;
            _barre = clearBarre(_positions);
        }

        public Guid ID { get; set; }

        public string Label { get; set; }

        [NotMapped]
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

        public string PositionsString
        {
            get => string.Join(",", _positions.Select(p => p == null ? "null" : p.ToString()));
            set
            {
                var test = value.Split(",").Select<string, int?>(p => {
                    if (p == "null") return null;
                    return int.Parse(p);
                }).ToList();

            }
        }

        [NotMapped]
        public List<int?> Barre {
            get => _barre;
            set => _barre = value;
        }

        public string BarreString => string.Join(",", _barre.Select(b => b == null ? "null" : b.ToString()));

        private List<int?> clearBarre(List<int?> positions)
        {
            return Enumerable.Repeat<int?>(null, positions.Count).ToList();
        }
    }
}
