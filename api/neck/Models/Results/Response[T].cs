using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Results
{
	public class Response<T>
	{
		public string message { get; set; }

		public Response(string errorMessage)
		{
			message = errorMessage;
		}

		public Response(OperationResult<T> result)
		{
			message = result.Message;
		}
	}
}
