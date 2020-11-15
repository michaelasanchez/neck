using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models
{
    public class ChordVariation
    {
        private List<int> _positions;
        private List<int?> _barre;

        // private _chordForm: ChordForm;

        public ChordVariation(List<int> positions, Chord chord, Tuning tuning, bool convert = false) {
            _positions = positions;
            _barre = Enumerable.Repeat<int?>(null, tuning.Offsets.Count).ToList();
        }
    
        public List<int> Positions => _positions;

        public List<int?> Barre => _barre;
    }
}
