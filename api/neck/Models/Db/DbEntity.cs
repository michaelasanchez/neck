using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace neck.Models.Db
{
    public class DbEntity : IDbEntity, IDatedEntity
    {
        [System.ComponentModel.DataAnnotations.Key]
        public Guid Id { get; set; }

        public DateTimeOffset Created { get; set; }
        public DateTimeOffset? Updated { get; set; }
    }
}
