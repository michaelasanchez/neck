using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
	public interface IOperationResult
	{
		public bool Success { get; }
		public string Message { get; }
		public Exception Exception { get; }
	}
}
