using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebAPI.Models;

namespace WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            Korisnici korisnici = new Korisnici("~/App_Data/Korisnici.txt");
            HttpContext.Current.Application["korisnici"] = korisnici;

            Dispeceri dispeceri = new Dispeceri("~/App_Data/Dispeceri.txt");
            HttpContext.Current.Application["dispeceri"] = dispeceri;

            Vozaci vozaci = new Vozaci("~/App_Data/Vozaci.txt");
            HttpContext.Current.Application["vozaci"] = vozaci;

            Voznje voznje = new Voznje("~/App_Data/Voznje.txt");
            HttpContext.Current.Application["voznje"] = voznje;
        }
    }
}
