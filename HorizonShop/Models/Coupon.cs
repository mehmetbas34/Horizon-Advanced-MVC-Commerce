using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace HorizonShop.Models
{
    public class Coupon
    {
        [Key]
        public int CouponId { get; set; }

        [Required]
        public string Code { get; set; } 

        public int DiscountRate { get; set; } 

        public bool IsActive { get; set; } 
    }
}