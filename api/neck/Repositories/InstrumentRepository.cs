using Microsoft.EntityFrameworkCore;
using neck.Interfaces;
using neck.Models;
using neck.Models.Entity;
using neck.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Repositories
{
    public class InstrumentRepository : GenericRepository<Instrument>
	{
		private Lazy<IRepository<Tuning>> _tuningRepo;

		public InstrumentRepository(NeckContext context, IRepository<Tuning> tuningRepository)
			: base(context)
		{
			// TODO: is there a better way to do this?
			GetAllDefaultIncludes = true;

			_tuningRepo = new Lazy<IRepository<Tuning>>(tuningRepository);
		}

		public override IQueryable<Instrument> DefaultIncludes()
		{
			return _set.AsQueryable().Include(i => i.DefaultTuning);
		}

        public override async Task<OperationResult<Instrument>> Create(Instrument entity)
        {
            var instrumentResult = await base.Create(entity);

			if (instrumentResult.Success)
            {
				var instrument = instrumentResult.Result;
				var tuningResult = await _tuningRepo.Value.Create(new Tuning()
				{
					InstrumentId = instrument.Id,
					Label = "Standard",
					Offsets = new List<Note>(instrument.NumStrings)
				});

				if (!tuningResult.Success)
				{
					instrumentResult.Success = false;
					instrumentResult.Message = "Instrument created. Failed to create default tuning";
				}
				else
				{
					instrument.DefaultTuning = tuningResult.Result;
					var updateResult = await Update(instrument);

					if (!updateResult.Success)
                    {
						instrumentResult.Success = false;
						instrumentResult.Message = "Instrument & default tuning created. Failed to associate default tuning";
                    }
                }
            }

			return instrumentResult;
        }
    }
}
