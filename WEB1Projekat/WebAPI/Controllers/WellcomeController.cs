﻿using System.Web;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
	public class WellcomeController : ApiController
	{
		public Korisnik Post([FromBody]Korisnik korisnik)
		{
			Dispeceri dispeceri = (Dispeceri)HttpContext.Current.Application["dispeceri"];
			Korisnici users = (Korisnici)HttpContext.Current.Application["korisnici"];
			Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];

			foreach (var item in users.korisnici)
			{
				if (korisnik.KorisnickoIme == item.KorisnickoIme)
				{
					return item;
				}
			}

			foreach (var item in dispeceri.dispecers)
			{
				if (korisnik.KorisnickoIme == item.KorisnickoIme)
				{
					return item;
				}
			}

			foreach (var item in vozaci.vozaci)
			{
				if (korisnik.KorisnickoIme == item.KorisnickoIme)
					return item;
			}

			return null;
		}
	}
}