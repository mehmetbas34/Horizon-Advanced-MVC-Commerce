using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace HorizonShop.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Category name is required.")]
        [Display(Name = "Category Name")]
        public string Name { get; set; }


        [Display(Name = "Category Image")]
        public string ImageUrl { get; set; } 

        [NotMapped] 
        public HttpPostedFileBase ImageFile { get; set; }


        public virtual ICollection<Product> Products { get; set; }
    }
}