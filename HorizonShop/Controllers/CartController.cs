using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;
using HorizonShop.Models;

namespace HorizonShop.Controllers
{
    public class CartController : Controller
    {
        private HorizonContext db = new HorizonContext();

        public ActionResult Index()
        {
            List<CartItem> cart = new List<CartItem>();

            if (Session["UserId"] != null)
            {
                // Account
                int userId = (int)Session["UserId"];

                cart = db.CartItems
                         .Include(c => c.Product.Category)
                         .Where(c => c.UserId == userId)
                         .ToList();
            }
            else
            {
                // Guest
                cart = GetGuestCart();
            }

            // Calculations
            decimal subTotal = cart.Sum(x => x.Quantity * x.Product.Price);
            decimal discountAmount = 0;

            // Coupon
            if (Session["CouponCode"] != null && Session["DiscountRate"] != null)
            {
                int rate = (int)Session["DiscountRate"];
                discountAmount = (subTotal * rate) / 100;
            }

            decimal grandTotal = subTotal - discountAmount;

            // Sending data to View
            ViewBag.SubTotal = subTotal;
            ViewBag.DiscountAmount = discountAmount;
            ViewBag.GrandTotal = grandTotal;
            ViewBag.AppliedCoupon = Session["CouponCode"];

            return View(cart);
        }

        //ADD TO CART
        public ActionResult AddToCart(int productId, int quantity = 1)
        {
            if (Session["UserId"] != null)
            {
                int userId = (int)Session["UserId"];
                var existingItem = db.CartItems.FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);

                if (existingItem != null)
                    existingItem.Quantity += quantity;
                else
                    db.CartItems.Add(new CartItem { UserId = userId, ProductId = productId, Quantity = quantity });

                db.SaveChanges();
            }
            else
            {
                var guestCart = GetGuestCart();
                var existingItem = guestCart.FirstOrDefault(c => c.ProductId == productId);

                if (existingItem != null)
                {
                    existingItem.Quantity += quantity;
                }
                else
                {
                    var product = db.Products
                                    .Include(p => p.Category)
                                    .FirstOrDefault(p => p.ProductId == productId);

                    if (product != null)
                    {
                        guestCart.Add(new CartItem
                        {
                            Id = new Random().Next(-10000, -1),
                            ProductId = productId,
                            Quantity = quantity,
                            Product = product
                        });
                    }
                }
                Session["GuestCart"] = guestCart;
            }

            UpdateCartCount();

            if (Request.UrlReferrer != null)
            {
                return Redirect(Request.UrlReferrer.ToString());
            }
            return RedirectToAction("Index", "Home");
        }

        //REMOVE
        public ActionResult RemoveFromCart(int id)
        {
            if (Session["UserId"] != null)
            {
                var item = db.CartItems.Find(id);
                if (item != null)
                {
                    db.CartItems.Remove(item);
                    db.SaveChanges();
                }
            }
            else
            {
                var guestCart = GetGuestCart();
                var item = guestCart.FirstOrDefault(c => c.Id == id);
                if (item != null) guestCart.Remove(item);
                Session["GuestCart"] = guestCart;
            }

            UpdateCartCount();
            return RedirectToAction("Index");
        }

        //Increase Quantity
        public ActionResult IncreaseQuantity(int id)
        {
            if (Session["UserId"] != null)
            {
                var item = db.CartItems.Find(id);
                if (item != null)
                {
                    item.Quantity++;
                    db.SaveChanges();
                }
            }
            else
            {
                var guestCart = GetGuestCart();
                var item = guestCart.FirstOrDefault(c => c.Id == id);
                if (item != null) item.Quantity++;
                Session["GuestCart"] = guestCart;
            }
            return RedirectToAction("Index");
        }

        // Decrease Quantity
        public ActionResult DecreaseQuantity(int id)
        {
            if (Session["UserId"] != null)
            {
                var item = db.CartItems.Find(id);
                if (item != null)
                {
                    if (item.Quantity > 1) item.Quantity--;
                    db.SaveChanges();
                }
            }
            else
            {
                var guestCart = GetGuestCart();
                var item = guestCart.FirstOrDefault(c => c.Id == id);
                if (item != null && item.Quantity > 1) item.Quantity--;
                Session["GuestCart"] = guestCart;
            }
            return RedirectToAction("Index");
        }

        // APPLY COUPON
        [HttpPost]
        public ActionResult ApplyCoupon(string couponCode)
        {
            if (string.IsNullOrEmpty(couponCode))
            {
                TempData["Error"] = "Please enter a coupon code.";
                return RedirectToAction("Index");
            }

            var coupon = db.Coupons.FirstOrDefault(c => c.Code == couponCode && c.IsActive == true);

            if (coupon != null)
            {
                Session["CouponCode"] = coupon.Code;
                Session["DiscountRate"] = coupon.DiscountRate;
                TempData["Success"] = "Coupon applied successfully! (" + coupon.DiscountRate + "% Off)";
            }
            else
            {
                TempData["Error"] = "Invalid or expired coupon code.";
            }

            return RedirectToAction("Index");
        }

        // REMOVE COUPON
        public ActionResult RemoveCoupon()
        {
            Session["CouponCode"] = null;
            Session["DiscountRate"] = null;
            TempData["Success"] = "Coupon removed.";
            return RedirectToAction("Index");
        }

        // 8. MINI CART -- PARTIAL VIEW
        [ChildActionOnly]
        public ActionResult MiniCart()
        {
            List<CartItem> cart = new List<CartItem>();

            if (Session["UserId"] != null)
            {
                int userId = (int)Session["UserId"];
                // DÜZELTME 3: Mini Cart için de aynı düzeltmeyi yaptık
                cart = db.CartItems
                         .Include(c => c.Product.Category)
                         .Where(c => c.UserId == userId)
                         .ToList();
            }
            else
            {
                cart = GetGuestCart();
            }

            return PartialView("_MiniCart", cart);
        }

        //HELPERS

        private List<CartItem> GetGuestCart()
        {
            if (Session["GuestCart"] == null)
                Session["GuestCart"] = new List<CartItem>();
            return (List<CartItem>)Session["GuestCart"];
        }

        private void UpdateCartCount()
        {
            if (Session["UserId"] != null)
            {
                int userId = (int)Session["UserId"];
                int count = db.CartItems.Where(c => c.UserId == userId).Sum(c => (int?)c.Quantity) ?? 0;
                Session["CartCount"] = count;
            }
            else
            {
                var guestCart = GetGuestCart();
                Session["CartCount"] = guestCart.Sum(c => c.Quantity);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}