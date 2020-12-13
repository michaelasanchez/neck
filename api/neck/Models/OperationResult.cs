using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace neck.Models
{
	public interface IOperationResult
	{
		public bool Success { get; }
		public string Message { get; }
		public Exception Exception { get; }
	}

	public interface IOperationResult<TResult> : IOperationResult
	{
		public TResult Result { get; }
	}

	public class OperationResult<TResult> : IOperationResult<TResult>
	{
		public OperationResult()
		{
		}

		public bool Success { get; set; }
		public TResult Result { get; set; }
		public string Message { get; set; }
		public Exception Exception { get; set; }

		public static OperationResult<TResult> CreateSuccess(TResult result)
		{
			return new OperationResult<TResult> { Success = true, Result = result };
		}

		public static OperationResult<TResult> CreateFailure(string nonSuccessMessage)
		{
			return new OperationResult<TResult> { Success = false, Message = nonSuccessMessage };
		}

		public static OperationResult<TResult> CreateFailure(Exception ex)
		{
			var cur = ex;
			var message = new StringBuilder(ex.Message);

			while (cur.InnerException != null)
			{
				cur = ex.InnerException;
				message.Append(String.Format("{1}{1}{0}", cur.Message, Environment.NewLine));
			}

			return new OperationResult<TResult>
			{
				Success = false,
				Message = String.Format("{0}{1}{1}{2}", GetInnerMessages(ex), Environment.NewLine, ex.StackTrace),
				Exception = ex
			};
		}

		private static string GetInnerMessages(Exception ex)
		{
			var cur = ex;
			var messages = new StringBuilder(ex.Message);

			while (cur.InnerException != null)
			{
				cur = ex.InnerException;
				messages.Append(String.Format("{1}{1}{0}", cur.Message, Environment.NewLine));
			}

			return messages.ToString();
		}
	}
}
