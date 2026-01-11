using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using HorizonShop.Models;

namespace HorizonShop.Controllers
{
    public class HomeController : Controller
    {
        private HorizonContext db = new HorizonContext();

        public ActionResult Index(int? categoryId, string searchTerm)
        {
            var productsQuery = db.Products.Include(p => p.Category).AsQueryable();

            //If Search
            if (!string.IsNullOrEmpty(searchTerm))
            {
                productsQuery = productsQuery.Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm));
                ViewBag.SearchTerm = searchTerm;
            }
            // If category choosen 
            else if (categoryId.HasValue)
            {
                productsQuery = productsQuery.Where(p => p.CategoryId == categoryId);
            }
            else
            {
                // IsFeatured true
                productsQuery = productsQuery.Where(p => p.IsFeatured == true);
            }

            var productList = productsQuery.ToList();

            if (Request.IsAjaxRequest())
            {
                return PartialView("_ProductList", productList);
            }

            return View(productList);
        }

        [ChildActionOnly]
        public ActionResult CategoryMenu()
        {
            var categories = db.Categories.ToList();
            return PartialView("_CategoryMenu", categories);
        }


        public ActionResult Category()
        {
            var categories = db.Categories.Include("Products").ToList();
            return View(categories);
        }

        public ActionResult CategoryProducts(int categoryId)
        {
            var products = db.Products
                             .Where(p => p.CategoryId == categoryId)
                             .Include(p => p.Category)
                             .ToList();

            if (products.Any())
            {
                ViewBag.CategoryName = products.First().Category.Name;
            }
            else
            {
                var category = db.Categories.Find(categoryId);
                ViewBag.CategoryName = category != null ? category.Name : "Category";
            }

            return View(products);
        }


        //Search Page
        public ActionResult Search(string searchTerm)
        {
            var products = db.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                products = products.Where(p => p.Name.Contains(searchTerm) || p.Description.Contains(searchTerm));
                ViewBag.SearchTerm = searchTerm;
            }
            else
            {
                // If search empty go to empty page
                products = products.Where(p => false);
            }

            return View(products.ToList());
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Blog()
        {
            return View();
        }

        public ActionResult Delivery()
        {
            return View();
        }

        public ActionResult Privacy()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        // POST: Contact
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Contact(ContactViewModel model)
        {
            if (ModelState.IsValid)
            {
                ViewBag.Message = "Thanks! Your message has been sent.";
                ModelState.Clear();
                return View();
            }

            return View(model);
        }

        // 8. DISPOSE (Closing database connection)
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}