using Microsoft.AspNetCore.Mvc;
using neck.Enums;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Args;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static neck.Enums.ChordEnums;

namespace neck.Controllers.DbEntity
{
    [ApiController]
    [Route("[controller]")]
    public class ChordController : EntityController<Chord>
    {
        private Lazy<IRepository<Note>> _noteRepo;
        private Lazy<IRepository<Chord>> _chordRepo;

        private IChordService _chordService;

        public ChordController(
            IRepository<Chord> repository,
            IRepository<Note> noteRepository,
            IChordService chordService)
            : base(repository)
        {
            _chordRepo = new Lazy<IRepository<Chord>>(repository);
            _noteRepo = new Lazy<IRepository<Note>>(noteRepository);

            _chordService = chordService;
        }

        // TODO: This really should just be get
        [HttpPost("byvalues")]
        public virtual async Task<ActionResult<Chord>> GetByValues(QuickChordArgs @params)
        {
            var note = new Note(@params.Value, @params.Suffix);

            var noteResult = await _noteRepo.Value.Locate(note);
            if (!noteResult.Success)
            {
                return BadRequest(new Response<Note>(noteResult));
            }

            var chord = new Chord(noteResult.Result, @params.Modifier);
            var chordResult = await _chordRepo.Value.Locate(chord);

            if (!chordResult.Success)
            {
                return BadRequest(new Response<Chord>(chordResult));
            }

            return Ok(chordResult.Result);
        }

        [HttpPost("search")]
        public async Task<ActionResult<List<Chord>>> Search(SearchArgs args)
        {
            OperationResult<List<Chord>> chordResult;

            try
            {
                 chordResult = await _chordService.Search(args);
            }
            catch (Exception ex)
            {
                return BadRequest(new Response<List<Chord>>(ex.Message));
            }

            if (!chordResult.Success)
            {
                return BadRequest(new Response<List<Chord>>(chordResult));
            }

            return Ok(chordResult.Result);
        }
    }

    public class QuickChordArgs
    {
        public NoteValue Value { get; set; }
        public NoteSuffix Suffix { get; set; }
        public ChordModifier Modifier { get; set; }
    }

}