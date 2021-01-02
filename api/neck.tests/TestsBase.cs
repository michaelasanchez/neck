using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace neck.tests
{
	public class TestsBase
	{
		protected string[] getLabelArray(List<Note> notes)
		{
			return notes.Select(n => n.PlainLabel).ToArray();
		}
	}
}
