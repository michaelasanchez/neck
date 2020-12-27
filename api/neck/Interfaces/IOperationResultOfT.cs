﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Interfaces
{
	public interface IOperationResult<TResult> : IOperationResult
	{
		public TResult Result { get; }
	}
}
