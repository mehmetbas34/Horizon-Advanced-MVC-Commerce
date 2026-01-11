using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using HorizonShop.Models;

namespace HorizonShop.Controllers
{
    [AdminAuthorize]
    public class UsersController : Controller
    {
        private HorizonContext db = new HorizonContext();

        // GET: Users List
        public ActionResult Index()
        {
            var users = db.Users.ToList();
            return View(users);
        }

        // GET: Edit User Role
        public ActionResult Edit(int? id)
        {
            if (id == null) return new HttpStatusCodeResult(System.Net.HttpStatusCode.BadRequest);

            var user = db.Users.Find(id);
            if (user == null) return HttpNotFound();

            List<SelectListItem> roles = new List<SelectListItem>
            {
                new SelectListItem { Text = "Customer", Value = "Customer" },
                new SelectListItem { Text = "Admin", Value = "Admin" }
            };

            ViewBag.RoleList = new SelectList(roles, "Value", "Text", user.Role);

            return View(user);
        }

        // POST: Edit User Role
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int UserId, string Role)
        {
            var user = db.Users.Find(UserId);

            if (user != null)
            {
                //if he/she trying to get role by him/her self
                if (user.UserId == (int)Session["UserId"] && Role == "Customer")
                {
                    TempData["Error"] = "You cannot remove your own Admin rights!";
                    return RedirectToAction("Index");
                }
                //Update role
                user.Role = Role;
                db.SaveChanges();
                TempData["Message"] = "User role updated successfully.";
            }

            return RedirectToAction("Index");
        }
    }
}