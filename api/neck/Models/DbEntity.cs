using neck.Interfaces;
using Newtonsoft.Json;
using System;

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
