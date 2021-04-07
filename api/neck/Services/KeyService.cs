using neck.Enums;
using neck.Interfaces;
using neck.Models.Entity;
using neck.Models.Results;
using neck.Services.Args;
using neck.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Services
{
    public class KeyService : IKeyService
    {
        private Lazy<IRepository<Key>> _keyRepo;
        private Lazy<IRepository<Note>> _noteRepo;

        public KeyService(IRepository<Key> repository, IRepository<Note> noteRepository)
        {
            _keyRepo = new Lazy<IRepository<Key>>(repository);
            _noteRepo = new Lazy<IRepository<Note>>(noteRepository);
        }

        public async Task<OperationResult<Key>> Locate(KeyLocateArgs args)
        {
            var note = new Note(args.Base, args.Suffix);

            var noteResult = await _noteRepo.Value.GetOrCreate(note);
            if (!noteResult.Success)
            {
                return OperationResult<Key>.CreateFailure(noteResult.Message);
            }

            var key = new Key(noteResult.Result, args.Type);

            var keyResult = await _keyRepo.Value.GetOrCreate(key);
            if (!keyResult.Success)
            {
                return OperationResult<Key>.CreateFailure(keyResult.Message);
            }

            return keyResult;
        }

        public Task<OperationResult<List<Key>>> Search(KeySearchArgs args)
        {
            var testKey = new Key(Note.C());


            return Task.FromResult(new OperationResult<List<Key>>()
            {
                Result = new List<Key>()
            });
        }
    }
}
