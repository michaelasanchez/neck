using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Services.Args
{
    public class SearchArgs
    {
        public List<Note> Notes { get; set; }

        public SearchArgs()
        {

        }

        public SearchArgs(List<Note> notes)
        {
            Notes = notes;
        }
    }
}
