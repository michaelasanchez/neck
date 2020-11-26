﻿using Microsoft.EntityFrameworkCore;
using neck.Models;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class ChordRepository : GenericRepository<Chord>
	{
		public ChordRepository(NeckContext context)
			: base(context)
		{
		}

		public override Task<Chord> Exists(Chord chord)
		{
			var result = _queryable
				.Include(c => c.Root)
				.FirstOrDefault(c => c.Root.Base == chord.Root.Base && c.Root.Suffix == chord.Root.Suffix && c.Modifier == chord.Modifier);

			return Task.FromResult(result);
		}

	}
}