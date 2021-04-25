using neck.Enums;
using neck.Models.Entity;

namespace neck.Services.Args
{
	public class KeyLocateArgs
    {
        public KeyType Type { get; set; }
        public NoteValue Base { get; set; }
        public NoteSuffix Suffix { get; set; }
    }
}
