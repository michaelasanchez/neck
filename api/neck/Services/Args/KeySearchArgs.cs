using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Services.Args
{
    public class KeySearchArgs
    {
        public List<Note> Notes { get; set; }

        public KeySearchArgs(List<Note> notes)
        {
            Notes = notes;
        }
    }
}
