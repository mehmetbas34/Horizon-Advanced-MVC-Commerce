using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HorizonShop.Models
{
    public class AdminAuthorize : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // If costumer join
            if (HttpContext.Current.Session["UserId"] == null)
            {
                filterContext.Result = new RedirectResult("/Account/Login");
                return;
            }

            //Custumer or admin?
            var userRole = HttpContext.Current.Session["UserRole"];
            if (userRole == null || userRole.ToString() != "Admin")
            {
                // If he/she is not admin redirect to index page
                filterContext.Result = new RedirectResult("/Home/Index");
                return;
            }

            base.OnActionExecuting(filterContext);
        }
    }
}