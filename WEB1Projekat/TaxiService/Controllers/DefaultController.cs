using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Http.Results;

namespace TaxiService.Controllers
{
    public class DefaultController : ApiController
    {
        [System.Web.Http.HttpGet, System.Web.Http.Route("")]
        public System.Web.Http.Results.RedirectResult Index()
        {
            var requestUri = Request.RequestUri;
            return Redirect(requestUri.AbsoluteUri + "index.html");
        }
    }
}