using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity; 
using HorizonShop.Models; 

namespace HorizonShop.Controllers
{
    public class CheckoutController : Controller
    {
        private HorizonContext db = new HorizonContext();

        // GET: Checkout Page
        public ActionResult Index()
        {
            if (Session["UserId"] == null)
            {
                return RedirectToAction("Login", "Account", new { returnUrl = "/Checkout" });
            }

            int userId = (int)Session["UserId"];

            var cart = db.CartItems.Where(c => c.UserId == userId).Include(i => i.Product).ToList();

            if (cart.Count == 0)
            {
                return RedirectToAction("Index", "Cart");
            }

            decimal subtotal = cart.Sum(x => x.Product.Price * x.Quantity);
            decimal shipping = 25.00m;
            decimal total = subtotal + shipping;

            ViewBag.CartItems = cart;
            ViewBag.Subtotal = subtotal;
            ViewBag.Shipping = shipping;
            ViewBag.Total = total;

            var user = db.Users.Find(userId);

            var orderModel = new Order
            {
                ShippingAddress = user.Address,
                City = user.City,
                ZipCode = user.ZipCode,
                Phone = user.Phone
            };

            return View(orderModel);
        }

        // POST: Place Order
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult PlaceOrder(Order order, string CardHolderName, string CardNumber, int ExpiryMonth, int ExpiryYear, string CVV)
        {
            if (Session["UserId"] == null) return RedirectToAction("Login", "Account");

            int userId = (int)Session["UserId"];
            var cart = db.CartItems.Where(c => c.UserId == userId).Include(i => i.Product).ToList();

            if (cart.Count == 0) return RedirectToAction("Index", "Home");

            order.UserId = userId;
            order.OrderDate = DateTime.Now;
            order.Status = "Processing"; 
            order.TotalAmount = cart.Sum(x => x.Product.Price * x.Quantity) + 25;

            db.Orders.Add(order);
            db.SaveChanges(); 

            // Pay now information save
            var payment = new Payment
            {
                OrderId = order.OrderId,
                CardHolderName = CardHolderName,
                CardNumber = CardNumber,
                ExpiryMonth = ExpiryMonth,
                ExpiryYear = ExpiryYear,
                CVV = CVV,
                PaymentDate = DateTime.Now
            };
            db.Payments.Add(payment);
            db.SaveChanges();

            // 3. See order details
            foreach (var item in cart)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Product.Price
                };
                db.OrderItems.Add(orderItem);
            }

            // Clean cart
            db.CartItems.RemoveRange(cart);
            db.SaveChanges();
            Session["CartCount"] = 0;

            return RedirectToAction("OrderSuccess", new { id = order.OrderId });
        }

        // GET: Order Success 
        public ActionResult OrderSuccess(int id)
        {
            return View(id);
        }
    }
}