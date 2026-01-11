using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HorizonShop.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        public int OrderId { get; set; }

        [Required]
        [Display(Name = "Card Holder Name")]
        public string CardHolderName { get; set; }

        [Required]
        [Display(Name = "Card Number")]
        public string CardNumber { get; set; }

        [Required]
        public int ExpiryMonth { get; set; }

        [Required]
        public int ExpiryYear { get; set; }

        [Required]
        public string CVV { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        public virtual Order Order { get; set; }
    }
}