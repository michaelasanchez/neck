using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace neck.Models.Entity
{
    public class Formation : DbEntity
    {
        // Position from string nut or open note
        public List<int?> Positions;

        // List of frets that can be barred
        //	ints correspond to beginning string index, if any
        private List<int?> _barres;

        [NotMapped]
        public List<int?> Barres
        {
            get
            {
                if (_barres == null) _barres = calcBarres();
                return _barres;
            }
        }

        public Formation(List<int?> positions)
        {
            Positions = positions;
        }

        private List<int?> calcBarres()
        {
            // Single barre for now
            var min = Positions.Min();
            if (min > 0 && Positions.Count(p => p == min) > 1)
            {
                var barres = Enumerable.Repeat<int?>(null, Positions.Max().Value - Positions.Min().Value + 1).ToList();
                barres[min.Value - Positions.Min().Value] = Positions.IndexOf(min);
                //barres[min.Value - Positions.Min().Value] = new List<int> { Positions.IndexOf(min), Positions.LastIndexOf(min) };


                return barres;
            }

            return null;
        }
    }
}
