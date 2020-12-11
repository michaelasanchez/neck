using neck.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.UnitsOfWork
{
	public class UnitOfWork : IDisposable
	{
		private NeckContext _context;
		//private GenericRepository<Department> departmentRepository;
		//private GenericRepository<Course> courseRepository;

		public UnitOfWork(NeckContext context)
		{
			_context = context;
		}

		//public GenericRepository<Department> DepartmentRepository
		//{
		//    get
		//    {

		//        if (this.departmentRepository == null)
		//        {
		//            this.departmentRepository = new GenericRepository<Department>(context);
		//        }
		//        return departmentRepository;
		//    }
		//}

		//public GenericRepository<Course> CourseRepository
		//{
		//    get
		//    {

		//        if (this.courseRepository == null)
		//        {
		//            this.courseRepository = new GenericRepository<Course>(context);
		//        }
		//        return courseRepository;
		//    }
		//}

		//public void Save()
		//{
		//    context.SaveChanges();
		//}

		private bool disposed = false;

		protected virtual void Dispose(bool disposing)
		{
			if (!this.disposed)
			{
				if (disposing)
				{
					_context.Dispose();
				}
			}
			this.disposed = true;
		}

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}
	}
}
