using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.IO;
using HorizonShop.Models;

namespace HorizonShop.Controllers
{
    public class ProductsController : Controller
    {
        private HorizonContext db = new HorizonContext();

        // GET: Products
        public ActionResult Index()
        {
            var products = db.Products.Include(p => p.Category).ToList();
            return View(products);
        }

        // GET: Products/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null) return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            Product product = db.Products.Include(p => p.Category).FirstOrDefault(p => p.ProductId == id);

            if (product == null) return HttpNotFound();

            return View(product);
        }

        // ADMIN ACTIONS
        // GET: Products/Create
        [AdminAuthorize]
        public ActionResult Create()
        {
            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name");
            return View();
        }

        // POST: Products/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        [AdminAuthorize]
        public ActionResult Create([Bind(Include = "ProductId,Name,Description,Price,CategoryId,ImageUrl,IsFeatured,ImageFile")] Product product)
        { //When filling the data from the form into the product object, accept ONLY the properties I wrote in these brackets, ignore everything else.
            if (ModelState.IsValid)
            {
                if (product.ImageFile != null)
                {
                    string fileName = Path.GetFileName(product.ImageFile.FileName);

                    string path = Path.Combine(Server.MapPath("~/Content/images/product/"), fileName);
                    product.ImageFile.SaveAs(path);
                    product.ImageUrl = "images/product/" + fileName; //Save path to database
                }

                db.Products.Add(product);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name", product.CategoryId);
            return View(product);
        }

        // GET: Products/Edit/5
        [AdminAuthorize]
        public ActionResult Edit(int? id)
        {
            if (id == null) return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            Product product = db.Products.Find(id);
            if (product == null) return HttpNotFound();

            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name", product.CategoryId);
            return View(product);
        }

        // POST: Products/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        [AdminAuthorize]
        public ActionResult Edit([Bind(Include = "ProductId,Name,Description,Price,CategoryId,ImageUrl,IsFeatured,ImageFile")] Product product)
        {
            if (ModelState.IsValid)
            {
                if (product.ImageFile != null)
                {
                    string fileName = Path.GetFileName(product.ImageFile.FileName);
                    string path = Path.Combine(Server.MapPath("~/Content/images/product/"), fileName);
                    product.ImageFile.SaveAs(path);
                    product.ImageUrl = "images/product/" + fileName;
                }
                else
                {
                    var oldProduct = db.Products.AsNoTracking().FirstOrDefault(p => p.ProductId == product.ProductId);
                    if (oldProduct != null)
                    {
                        product.ImageUrl = oldProduct.ImageUrl;
                    }
                }

                db.Entry(product).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryId = new SelectList(db.Categories, "CategoryId", "Name", product.CategoryId);
            return View(product);
        }

        // GET: Products/Delete/5
        [AdminAuthorize]
        public ActionResult Delete(int? id)
        {
            if (id == null) return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            Product product = db.Products.Find(id);
            if (product == null) return HttpNotFound();

            return View(product);
        }

        // POST: Products/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [AdminAuthorize]
        public ActionResult DeleteConfirmed(int id)
        {
            Product product = db.Products.Find(id);

            db.Products.Remove(product);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}