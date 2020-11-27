using neck.Interfaces;
using neck.Models;
using System;
using System.Threading.Tasks;

namespace neck.Repositories
{
	public class ChordVariationRepository : GenericRepository<ChordVariation>
	{
		private Lazy<IRepository<Chord>> _chordRepo;
		private Lazy<IRepository<Formation>> _formationRepo;
		private Lazy<IRepository<Tuning>> _tuningRepo;

		public ChordVariationRepository(
			NeckContext context,
			IRepository<Chord> chordRepository,
			IRepository<Formation> formationRepository,
			IRepository<Tuning> tuningRepository
		)
			: base(context)
		{
			_chordRepo = new Lazy<IRepository<Chord>>(chordRepository);
			_formationRepo = new Lazy<IRepository<Formation>>(formationRepository);
			_tuningRepo = new Lazy<IRepository<Tuning>>(tuningRepository);
		}

		public override async Task<OperationResult<int>> Insert(ChordVariation variation)
		{
			if (variation.Formation != null)
			{
				var formation = await _formationRepo.Value.Exists(variation.Formation);
				if (formation != null)
				{
					variation.Formation = formation;
				}
			}

			if (variation?.Chord?.Root != null)
			{
				var chord = await _chordRepo.Value.Exists(variation.Chord);
				if (chord != null)
				{
					variation.Chord = chord;
				}
			}

			if (variation.Tuning != null)
			{
				var tuning = await _tuningRepo.Value.Exists(variation.Tuning);
				if (tuning != null)
				{
					variation.Tuning = tuning;
				}
			}

			return await base.Insert(variation);
		}
	}
}
