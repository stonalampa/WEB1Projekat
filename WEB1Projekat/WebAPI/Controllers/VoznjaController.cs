using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using WebAPI.Models;

namespace WebAPI.Controllers
{
	public class VoznjaController : ApiController
	{
		public List<Voznja> Get()
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];
			return voznje.voznje;
		}
		[Route("api/Voznja/Put/{id:int}")]
		public bool Put(int id, [FromBody]Voznja voznja) // izmena voznje iz Musterije
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];
			foreach (var item in voznje.voznje)
			{
				if (item.IdVoznje == id)
				{
					item.Lokacija.X = voznja.Lokacija.X;
					item.Lokacija.Y = voznja.Lokacija.Y;
					item.Lokacija.Adresa.UlicaBroj = voznja.Lokacija.Adresa.UlicaBroj;

					string[] dijelovi = voznja.Lokacija.Adresa.NaseljenoMjesto.Split(' ');
					voznja.Lokacija.Adresa.NaseljenoMjesto = null;
					dijelovi = dijelovi.Where(x => !string.IsNullOrEmpty(x)).ToArray();

					int br = 0;
					for (int i = 0; i < dijelovi.Length; i++)
					{
						int n;
						bool isNumeric = Int32.TryParse(dijelovi[i], out n);
						if (isNumeric)
						{
							voznja.Lokacija.Adresa.PozivniBroj = dijelovi[i];
							break;
						}
						else
						{
							if (br > 0)
							{
								voznja.Lokacija.Adresa.NaseljenoMjesto += " " + dijelovi[i];
							}
							else
							{
								voznja.Lokacija.Adresa.NaseljenoMjesto += dijelovi[i];
								br++;
							}
						}
					}

					item.Lokacija.Adresa.NaseljenoMjesto = voznja.Lokacija.Adresa.NaseljenoMjesto;
					item.Lokacija.Adresa.PozivniBroj = voznja.Lokacija.Adresa.PozivniBroj;
					item.Automobil = voznja.Automobil;
					UpisUTxt(item);
					return true;
				}
			}
			return false;
		}

		[Route("api/Voznja/PutOtkaz/{id:int}")]
		public bool PutOtkaz(int id, [FromBody]Voznja voznja) // Kad se voznja otkazuje iz musterije
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];

			foreach (Voznja item in voznje.voznje)
			{
				if (item.IdVoznje == id)
				{
					item.Komentar.Opis = voznja.Komentar.Opis;
					item.Komentar.DatumObjave = DateTime.Now;
					item.Komentar.KorisnickoIme = voznja.Musterija;
					item.Komentar.IdVoznje = item.IdVoznje;
					item.Komentar.OcenaVoznje = voznja.Komentar.OcenaVoznje;
					item.Status = StatusVoznje.Status.OTKAZANA;
					UpisUTxt(item);
					return true;
				}
			}
			return false;
		}

		[Route("api/Voznja/PutVozac/{id:int}")]
		public bool PutVozac(int id, [FromBody]Voznja voznja) // Dodavanje vozaca za voznju
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];
			Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];

			foreach (var item in voznje.voznje)
			{
				if (item.IdVoznje == id)
				{
					foreach (var vozac in vozaci.vozaci)
					{
						if (vozac.KorisnickoIme == voznja.Vozac)
						{
							vozac.Zauzet = true;
							IzmeniVozaca(vozac);
							break;
						}
					}
					item.Vozac = voznja.Vozac;
					item.Iznos = voznja.Iznos;
					item.Dispecer = voznja.Dispecer;
					item.Status = voznja.Status;
					UpisUTxt(item);
					return true;
				}
			}
			return false;
		}

		[Route("api/Voznja/PutVozacUspesno/{id:int}")]
		public bool PutVozacUspesno(int id, [FromBody]Voznja voznja) // Postavljanje voznje kao uspesno
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];
			Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];

			foreach (var item in voznje.voznje)
			{
				if (item.IdVoznje == id)
				{
					item.Odrediste.X = voznja.Odrediste.X;
					item.Odrediste.Y = voznja.Odrediste.Y;
					item.Odrediste.Adresa.UlicaBroj = voznja.Odrediste.Adresa.UlicaBroj;

					string[] dijelovi = voznja.Odrediste.Adresa.NaseljenoMjesto.Split(' ');
					voznja.Odrediste.Adresa.NaseljenoMjesto = null;
					dijelovi = dijelovi.Where(x => !string.IsNullOrEmpty(x)).ToArray();

					int br = 0;
					for (int i = 0; i < dijelovi.Length; i++)
					{
						int n;
						bool isNumeric = Int32.TryParse(dijelovi[i], out n);
						if (isNumeric)
						{
							voznja.Odrediste.Adresa.PozivniBroj = dijelovi[i];
							break;
						}
						else
						{
							if (br > 0)
							{
								voznja.Odrediste.Adresa.NaseljenoMjesto += " " + dijelovi[i];
							}
							else
							{
								voznja.Odrediste.Adresa.NaseljenoMjesto += dijelovi[i];
								br++;
							}
						}
					}

					item.Odrediste.Adresa.NaseljenoMjesto = voznja.Odrediste.Adresa.NaseljenoMjesto;
					item.Odrediste.Adresa.PozivniBroj = voznja.Odrediste.Adresa.PozivniBroj;
					item.Status = voznja.Status;
					item.Iznos = voznja.Iznos;
					UpisUTxt(item);
					foreach (var vozac in vozaci.vozaci)
					{
						if (vozac.KorisnickoIme == voznja.Vozac)
						{
							vozac.Zauzet = false;
							IzmeniVozaca(vozac);
							break;
						}
					}
					return true;
				}
			}
			return false;
		}

		[Route("api/Voznja/PutPrihvacena/{id:int}")]
		public bool PutPrihvacena(int id, [FromBody]Voznja voznja)
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];
			Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];
			foreach (var item in voznje.voznje)
			{
				if (item.IdVoznje == id)
				{
					item.Vozac = voznja.Vozac;
					item.Dispecer = voznja.Dispecer;
					item.Iznos = voznja.Iznos;
					item.Status = voznja.Status;
					foreach (var vozac in vozaci.vozaci)
					{
						if (vozac.KorisnickoIme == voznja.Vozac)
						{
							vozac.Zauzet = true;
							IzmeniVozaca(vozac);
							break;
						}
					}
					UpisUTxt(item);
					return true;
				}
			}
			return false;
		}

		[Route("api/Voznja/PutVozacNeuspesno/{id:int}")]
		public bool PutVozacNeuspesno(int id, [FromBody]Voznja voznja) // Kad je voznja neuspesna
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];
			Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];

			foreach (var item in voznje.voznje)
			{
				if (item.IdVoznje == id)
				{
					item.Komentar.IdVoznje = voznja.Komentar.IdVoznje;
					item.Komentar.KorisnickoIme = voznja.Komentar.KorisnickoIme;
					item.Komentar.OcenaVoznje = voznja.Komentar.OcenaVoznje;
					item.Komentar.Opis = voznja.Komentar.Opis;
					item.Komentar.DatumObjave = item.Komentar.DatumObjave;
					item.Status = voznja.Status;
					item.Vozac = voznja.Vozac;
					item.Iznos = voznja.Iznos;
					foreach (var vozac in vozaci.vozaci)
					{
						if (vozac.KorisnickoIme == voznja.Vozac)
						{
							vozac.Zauzet = false;
							IzmeniVozaca(vozac);
							break;
						}
					}
					UpisUTxt(item);
					return true;
				}
			}
			return false;
		}

		[Route("api/Voznja/PutUspesnaKomentar/{id:int}")]
		public bool PutUspesnaKomentar(int id, [FromBody]Voznja voznja) //Komentarisanje voznje kad je uspesna
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];

			foreach (var item in voznje.voznje)
			{
				if (item.IdVoznje == id)
				{
					item.Komentar.OcenaVoznje = voznja.Komentar.OcenaVoznje;
					item.Komentar.Opis = voznja.Komentar.Opis;
					item.Komentar.DatumObjave = DateTime.Now;
					item.Komentar.KorisnickoIme = voznja.Komentar.KorisnickoIme;
					UpisUTxt(item);
					return true;
				}
			}
			return false;
		}
		public void IzmeniVozaca(Vozac vozac)
		{
			Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];
			string path = "~/App_Data/Vozaci.txt";
			path = HostingEnvironment.MapPath(path);

			StringBuilder sb = new StringBuilder();
			sb.Append(vozac.Id + ";" + vozac.KorisnickoIme + ";" + vozac.Lozinka + ";" + vozac.Ime + ";" + vozac.Prezime + ";" + vozac.Pol + ";" + vozac.JMBG + ";" + vozac.Telefon + ";" + vozac.Email + ";" + vozac.Uloga + ";" + vozac.Voznja + ";" + vozac.Lokacija.X + ";" + vozac.Lokacija.Y + ";" + vozac.Lokacija.Adresa.UlicaBroj + ";" + vozac.Lokacija.Adresa.NaseljenoMjesto + ";" + vozac.Lokacija.Adresa.PozivniBroj + ";" + vozac.Automobil.Vozac + ";" + vozac.Automobil.GodisteAutomobila + ";" + vozac.Automobil.BrojRegistarskeOznake + ";" + vozac.Automobil.BrojTaksiVozila + ";" + vozac.Automobil.Tip + ";" + vozac.Zauzet + "\n");
			string[] arrLine = File.ReadAllLines(path);
			arrLine[vozac.Id - 1] = sb.ToString();
			File.WriteAllLines(path, arrLine);
			File.WriteAllLines(path, File.ReadAllLines(path).Where(l => !string.IsNullOrWhiteSpace(l)));

			vozaci = new Vozaci("~/App_Data/Vozaci.txt");
			HttpContext.Current.Application["vozaci"] = vozaci;

		}

		public void UpisUTxt(Voznja v)
		{
			Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];
			string path = "~/App_Data/Voznje.txt";
			path = HostingEnvironment.MapPath(path);
			StringBuilder sb = new StringBuilder();
			sb.Append(v.IdVoznje + ";" + v.VremePorudzbine + ";" + v.Lokacija.X + ";" + v.Lokacija.Y + ";" + v.Lokacija.Adresa.UlicaBroj + ";" + v.Lokacija.Adresa.NaseljenoMjesto + ";" + v.Lokacija.Adresa.PozivniBroj + ";" + v.Automobil + ";" + v.Musterija + ";" + v.Odrediste.X + ";" + v.Odrediste.Y + ";" + v.Odrediste.Adresa.UlicaBroj + ";" + v.Odrediste.Adresa.NaseljenoMjesto + ";" + v.Odrediste.Adresa.PozivniBroj + ";" + v.Dispecer + ";" + v.Vozac + ";" + v.Iznos + ";" + v.Komentar.Opis + ";" + v.Komentar.DatumObjave + ";" + v.Komentar.KorisnickoIme + ";" + v.Komentar.IdVoznje + ";" + v.Komentar.OcenaVoznje + ";" + v.Status + "\n");
			string[] arrLine = File.ReadAllLines(path);
			arrLine[v.IdVoznje - 1] = sb.ToString();
			File.WriteAllLines(path, arrLine);
			File.WriteAllLines(path, File.ReadAllLines(path).Where(l => !string.IsNullOrWhiteSpace(l)));
			voznje = new Voznje("~/App_Data/Voznje.txt");
			HttpContext.Current.Application["voznje"] = voznje;
		}
	}
}