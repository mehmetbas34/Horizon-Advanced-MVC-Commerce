using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HorizonShop.Models;

namespace HorizonShop.Controllers
{
    public class AccountController : Controller
    {
        private HorizonContext db = new HorizonContext();

        // GET: Register
        public ActionResult Register()
        {
            return View();
        }

        // POST: Register
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Register(User model)
        {
            if (ModelState.IsValid)
            {
                if (db.Users.Any(u => u.Email == model.Email))
                {
                    ViewBag.Error = "This email is already registered.";
                    return View(model);
                }

                db.Users.Add(model);
                db.SaveChanges();
                return RedirectToAction("Login");
            }
            return View(model);
        }

        // GET: Login (If this one is missing we will get 404 not found error)
        public ActionResult Login()
        {
            return View();
        }

        // POST: Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = db.Users.FirstOrDefault(u => u.Email == model.Email && u.Password == model.Password);

                if (user != null)
                {
                    // Oturum Başlat
                    Session["UserId"] = user.UserId;
                    Session["UserEmail"] = user.Email;
                    Session["UserName"] = user.FirstName;
                    Session["UserRole"] = user.Role;
                    //  To adding guess card to account
                    if (Session["GuestCart"] != null)
                    {
                        var guestCart = Session["GuestCart"] as List<CartItem>;
                        foreach (var item in guestCart)
                        {
                            var existing = db.CartItems.FirstOrDefault(c => c.UserId == user.UserId && c.ProductId == item.ProductId);
                            if (existing != null)
                            {
                                existing.Quantity += item.Quantity;
                            }
                            else
                            {
                                db.CartItems.Add(new CartItem
                                {
                                    UserId = user.UserId,
                                    ProductId = item.ProductId,
                                    Quantity = item.Quantity
                                });
                            }
                        }
                        db.SaveChanges();
                        Session["GuestCart"] = null; // Clean
                    }


                    // Sayacı Güncelle
                    Session["CartCount"] = db.CartItems.Where(c => c.UserId == user.UserId).Sum(c => (int?)c.Quantity) ?? 0;

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ViewBag.Error = "Invalid email or password.";
                }
            }
            return View(model);
        }

        // GET: Logout
        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Index", "Home");
        }

        //ORDERS & ADDRESSES

        public ActionResult Orders()
        {
            if (Session["UserId"] == null) return RedirectToAction("Login");
            int userId = (int)Session["UserId"];
            var orders = db.Orders.Where(x => x.UserId == userId).OrderByDescending(x => x.OrderDate).ToList();
            return View(orders);
        }

        public ActionResult OrderDetails(int id)
        {
            if (Session["UserId"] == null) return RedirectToAction("Login");
            int userId = (int)Session["UserId"];

            return View(); 
        }

        // Address method
        public ActionResult Addresses()
        {
            if (Session["UserId"] == null) return RedirectToAction("Login");
            int userId = (int)Session["UserId"];
            var user = db.Users.Find(userId);
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Addresses(User model)
        {
            if (Session["UserId"] == null) return RedirectToAction("Login");
            var user = db.Users.Find(Session["UserId"]);
            if (user != null)
            {
                user.Address = model.Address;
                user.City = model.City;
                user.Country = model.Country;
                user.ZipCode = model.ZipCode;
                user.Phone = model.Phone;
                db.SaveChanges();
                ViewBag.Message = "Address updated successfully!";
            }
            return View(user);
        }
    }
}