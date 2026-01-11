using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;


namespace HorizonShop.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public string Phone { get; set; }

        [Display(Name = "Street Address")]
        public string Address { get; set; } 

        [Display(Name = "City")]
        public string City { get; set; }

        [Display(Name = "Country")]
        public string Country { get; set; }

        [Display(Name = "Zip / Postal Code")]
        public string ZipCode { get; set; }

        public string Role { get; set; } = "Customer";

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}