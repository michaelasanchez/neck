using neck.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace neck.Models
{
    public abstract class DbEntity : IDbEntity, IDatedEntity
    {
        [System.ComponentModel.DataAnnotations.Key]
        public Guid Id { get; set; }

        [JsonIgnore]
        public DateTimeOffset Created { get; set; }

        [JsonIgnore]
        public DateTimeOffset? Updated { get; set; }
    }
}
