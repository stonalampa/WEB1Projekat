using System.Web.Http;
using System.Web.Http.Results;

namespace WebAPI.Controllers
{
	public class DefaultController : ApiController
	{
		[HttpGet, Route("")]
		public RedirectResult Index()
		{
			var requestUri = Request.RequestUri;
			return Redirect(requestUri.AbsoluteUri + "index.html");
		}
	}
}