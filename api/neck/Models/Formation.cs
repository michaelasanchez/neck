﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace neck.Models
{
	public class Formation : DbEntity
	{
		// Position from string nut or open note
		public List<int?> Positions;

		private List<int> _barres;

		[NotMapped]
		public List<int> Barres
		{
			get
			{
				if (_barres == null) _barres = calcBarres();
				return _barres;
			}
		}

		public ICollection<ChordVariation> ChordVariations;

		public Formation(List<int?> positions)
		{
			Positions = positions;
		}

		private List<int> calcBarres()
		{
			var barres = new List<int>();

			var min = Positions.Min();
			if (min > 0 && Positions.Count(p => p == min) > 1)
			{
				barres.Add(Positions.IndexOf(min));
				return barres;
			}
			else
			{
				return barres;
			}
		}
	}
}
