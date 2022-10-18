﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NinosConValorAPI.Data.Entity
{
    public class FixedAssetEntity
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public int Quantity { get; set; }

        public string? Description { get; set; }
        public DateTime? EntryDate { get; set; }
        public string? Features { get; set; }

        [ForeignKey("ProgramHouseId")]
        public virtual ProgramHouseEntity? ProgramHouse { get; set; }
    }
}
