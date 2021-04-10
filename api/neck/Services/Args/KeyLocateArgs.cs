using neck.Enums;
using neck.Models.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Services.Args
{
    public class KeyLocateArgs
    {
        public KeyType Type;
        public NoteValue Base;
        public NoteSuffix Suffix;
    }
}
