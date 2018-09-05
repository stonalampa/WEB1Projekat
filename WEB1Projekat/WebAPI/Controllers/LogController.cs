using System.Web;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
	public class LogController : ApiController
	{
		public bool Post([FromBody]Korisnik korisnik)
		{
			Korisnici users = (Korisnici)HttpContext.Current.Application["korisnici"];
			Dispeceri dispeceri = (Dispeceri)HttpContext.Current.Application["dispeceri"];
			Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];
			foreach (var item in users.korisnici)
			{
				if (item.KorisnickoIme == korisnik.KorisnickoIme && item.Lozinka == korisnik.Lozinka)
				{
					return true;
				}
			}

			foreach (var item in dispeceri.dispecers)
			{
				if (item.KorisnickoIme == korisnik.KorisnickoIme && item.Lozinka == korisnik.Lozinka)
					return true;
			}

			foreach (var item in vozaci.vozaci)
			{
				if (item.KorisnickoIme == korisnik.KorisnickoIme && item.Lozinka == korisnik.Lozinka)
					return true;
			}
			return false;
		}

	}
}