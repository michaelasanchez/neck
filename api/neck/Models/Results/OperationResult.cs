using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace neck.Models.Results
{

	public class OperationResult : IOperationResult
	{
		public OperationResult()
		{
		}

		public bool Success { get; set; }
		public string Message { get; set; }
		public Exception Exception { get; set; }

		public static OperationResult CreateSuccess()
		{
			return new OperationResult { Success = true };
		}

		public static OperationResult CreateFailure(string failureMessage)
		{
			return new OperationResult { Success = false, Message = failureMessage };
		}

		public static OperationResult CreateFailure(Exception ex)
		{
			var cur = ex;
			var message = new StringBuilder(ex.Message);

			while (cur.InnerException != null)
			{
				cur = ex.InnerException;
				message.Append(String.Format("{1}{1}{0}", cur.Message, Environment.NewLine));
			}

			return new OperationResult
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

		#region Utility

		// TODO: Figure out where to put this
		public static string trimType(Type type)
		{
			var test = type.ToString().Split(".");
			return test[test.Length - 1].ToLower();
		}

		#endregion
	}
}
