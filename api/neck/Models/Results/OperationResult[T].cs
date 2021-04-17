using neck.Interfaces;
using System;
using System.Text;

namespace neck.Models.Results
{
	public class OperationResult<TResult> : IOperationResult<TResult>
	{
		public OperationResult() { }

		public bool Success { get; set; }
		public TResult Result { get; set; }
		public string Message { get; set; }
		public Exception Exception { get; set; }

		public static OperationResult<TResult> CreateSuccess(TResult result)
		{
			return new OperationResult<TResult> { Success = true, Result = result };
		}

		public static OperationResult<TResult> CreateFailure(string failureMessage)
		{
			return new OperationResult<TResult> { Success = false, Message = failureMessage };
		}

		public static OperationResult CreateFailuree<TResult>(string failureMessage)
		{
			return new OperationResult { Success = false, Message = failureMessage };
		}

		public static OperationResult<TResult> CreateFailure(Exception ex)
		{
			return new OperationResult<TResult>
			{
				Success = false,
				Message = String.Format("{0}{1}{1}{2}", getInnerMessages(ex), Environment.NewLine, ex.StackTrace),
				Exception = ex
			};
		}

		private static string getInnerMessages(Exception ex)
		{
			var current = ex;
			var messages = new StringBuilder(current.Message);

			while (current.InnerException != null)
			{
				current = current.InnerException;
				messages.Append(String.Format("{1}{1}{0}", current.Message, Environment.NewLine));
			}

			return messages.ToString();
		}
	}
}
