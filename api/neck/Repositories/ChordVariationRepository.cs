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

		public override async Task<OperationResult<int>> Create(ChordVariation variation)
		{
			if (variation.Formation != null)
			{
				var formationResult = await _formationRepo.Value.Get(variation.Formation);
				if (formationResult.Success)
				{
					variation.Formation = formationResult.Result;
				}
			}

			if (variation?.Chord?.Root != null)
			{
				var chordResult = await _chordRepo.Value.Get(variation.Chord);
				if (chordResult.Success)
				{
					variation.Chord = chordResult.Result;
				}
			}

			if (variation.Tuning != null)
			{
				var tuningResult = await _tuningRepo.Value.Get(variation.Tuning);
				if (tuningResult.Success)
				{
					variation.Tuning = tuningResult.Result;
				}
			}

			return await base.Create(variation);
		}
	}
}
