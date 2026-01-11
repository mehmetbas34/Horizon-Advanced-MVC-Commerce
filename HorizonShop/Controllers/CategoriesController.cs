using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.IO; // For files
using HorizonShop.Models;

namespace HorizonShop.Controllers
{
    [AdminAuthorize]
    public class CategoriesController : Controller
    {
        private HorizonContext db = new HorizonContext();

        // GET: Categories
        public ActionResult Index()
        {
            return View(db.Categories.ToList());
        }

        // GET: Categories/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Category category = db.Categories.Find(id);
            if (category == null)
            {
                return HttpNotFound();
            }
            return View(category);
        }

        // GET: Categories/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Categories/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Category category)
        {
            if (ModelState.IsValid)
            {
                if (category.ImageFile != null && category.ImageFile.ContentLength > 0)
                {
                    string fileName = Path.GetFileName(category.ImageFile.FileName);

                    string path = Path.Combine(Server.MapPath("~/Content/images/category/"), fileName);

                    category.ImageFile.SaveAs(path);

                    category.ImageUrl = "images/category/" + fileName;
                }

                db.Categories.Add(category);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(category);
        }

        // GET: Categories/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Category category = db.Categories.Find(id);
            if (category == null)
            {
                return HttpNotFound();
            }
            return View(category);
        }

        // POST: Categories/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Category category)
        {
            if (ModelState.IsValid)
            {
                var existingCategory = db.Categories.AsNoTracking().FirstOrDefault(c => c.CategoryId == category.CategoryId);

                if (category.ImageFile != null && category.ImageFile.ContentLength > 0)
                {
                    string fileName = Path.GetFileName(category.ImageFile.FileName);
                    string path = Path.Combine(Server.MapPath("~/Content/images/category/"), fileName);

                    category.ImageFile.SaveAs(path);
                    category.ImageUrl = "images/category/" + fileName;
                }
                else
                {
                    if (existingCategory != null)
                    {
                        category.ImageUrl = existingCategory.ImageUrl;
                    }
                }

                db.Entry(category).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(category);
        }

        // GET: Categories/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Category category = db.Categories.Find(id);
            if (category == null)
            {
                return HttpNotFound();
            }
            return View(category);
        }

        // POST: Categories/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Category category = db.Categories.Find(id);
            db.Categories.Remove(category);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

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