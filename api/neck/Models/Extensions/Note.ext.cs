using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Extensions
{
    public static class NoteExtensions
    {
        public static Note Flat(this Note note)
        {
            note.Suffix = Enums.NoteSuffix.Flat;
            return note;
        }

        public static Note Sharp(this Note note)
        {
            note.Suffix = Enums.NoteSuffix.Sharp;
            return note;
        }
    }
}
