using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Mvc;
using TaxiService.Models;

namespace TaxiService.Controllers
{
    public class DispecerController : ApiController
    {
        public bool Put(int id, [FromBody]Dispecer korisnik)
        {
            Dispeceri dispeceri = (Dispeceri)HttpContext.Current.Application["dispeceri"];

            string path = "~/App_Data/Dispeceri.txt";
            path = HostingEnvironment.MapPath(path);
            foreach (var item in dispeceri.dispecers)
            {
                if (item.Id == id)
                {
                    item.KorisnickoIme = korisnik.KorisnickoIme;
                    item.Lozinka = korisnik.Lozinka;
                    item.Ime = korisnik.Ime;
                    item.Prezime = korisnik.Prezime;
                    item.JMBG = korisnik.JMBG;
                    item.Pol = korisnik.Pol;
                    item.Uloga = korisnik.Uloga;
                    item.Telefon = korisnik.Telefon;
                    item.Email = korisnik.Email;
                    item.Voznja = korisnik.Voznja;
                    StringBuilder sb = new StringBuilder();
                    sb.Append(item.Id + ";" + item.KorisnickoIme + ";" + item.Lozinka + ";" + item.Ime + ";" + item.Prezime + ";" + item.Pol + ";" + item.JMBG + ";" + item.Telefon + ";" + item.Email + ";" + item.Uloga + ";" + item.Voznja + "\n");
                    string[] arrLine = File.ReadAllLines(path);
                    arrLine[item.Id - 1] = sb.ToString();
                    File.WriteAllLines(path, arrLine);
                    File.WriteAllLines(path, File.ReadAllLines(path).Where(l => !string.IsNullOrWhiteSpace(l)));

                    dispeceri = new Dispeceri("~/App_Data/Dispeceri.txt");
                    HttpContext.Current.Application["dispeceri"] = dispeceri;
                    return true;
                }
            }
            return false;
        }

        [System.Web.Http.Route("api/Dispecer/PostD")]
        public bool PostD([FromBody]Voznja voznja)
        {
            Voznje voznje = (Voznje)HttpContext.Current.Application["voznje"];

            voznja.IdVoznje = voznje.voznje.Count + 1;
            voznja.VremePorudzbine = DateTime.Now;
            voznja.Status = StatusVoznje.Status.FORMIRANA;
            voznja.Odrediste = new Lokacija("", "", "", "", "");
            voznja.Komentar = new Komentar("", DateTime.Now.ToString(), "", voznja.IdVoznje.ToString(), "0");

            StringBuilder sb = new StringBuilder();
            Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];

            string pathV = "~/App_Data/Vozaci.txt";
            pathV = HostingEnvironment.MapPath(pathV);

            foreach (var item in vozaci.vozaci)
            {
                if (item.KorisnickoIme == voznja.Vozac)
                {
                    item.Zauzet = true;
                    StringBuilder sb1 = new StringBuilder();
                    sb1.Append(item.Id + ";" + item.KorisnickoIme + ";" + item.Lozinka + ";" + item.Ime + ";" + item.Prezime + ";" + item.Pol + ";" + item.JMBG + ";" + item.Telefon + ";" + item.Email + ";" + item.Uloga + ";" + item.Voznja + ";" + item.Lokacija.X + ";" + item.Lokacija.Y + ";" + item.Lokacija.Adresa.UlicaBroj + ";" + item.Lokacija.Adresa.NaseljenoMjesto + ";" + item.Lokacija.Adresa.PozivniBroj + ";" + item.Automobil.Vozac + ";" + item.Automobil.GodisteAutomobila + ";" + item.Automobil.BrojRegistarskeOznake + ";" + item.Automobil.BrojTaksiVozila + ";" + item.Automobil.Tip + ";" + item.Zauzet + "\n");
                    string[] arrLine = File.ReadAllLines(pathV);
                    arrLine[item.Id - 1] = sb1.ToString();
                    File.WriteAllLines(pathV, arrLine);
                    File.WriteAllLines(pathV, File.ReadAllLines(pathV).Where(l => !string.IsNullOrWhiteSpace(l)));
                    vozaci = new Vozaci("~/App_Data/Vozaci.txt");
                    HttpContext.Current.Application["vozaci"] = vozaci;
                    break;
                }
            }

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

            sb.Append(voznja.IdVoznje + ";" + voznja.VremePorudzbine + ";" + voznja.Lokacija.X + ";" + voznja.Lokacija.Y + ";" + voznja.Lokacija.Adresa.UlicaBroj + ";" + voznja.Lokacija.Adresa.NaseljenoMjesto + ";" + voznja.Lokacija.Adresa.PozivniBroj + ";" + voznja.Automobil + ";" + voznja.Musterija + ";" + voznja.Odrediste.X + ";" + voznja.Odrediste.Y + ";" + voznja.Odrediste.Adresa.UlicaBroj + ";" + voznja.Odrediste.Adresa.NaseljenoMjesto + ";" + voznja.Odrediste.Adresa.PozivniBroj + ";" + voznja.Dispecer + ";" + voznja.Vozac + ";" + voznja.Iznos + ";" + voznja.Komentar.Opis + ";" + voznja.Komentar.DatumObjave + ";" + voznja.Komentar.KorisnickoIme + ";" + voznja.Komentar.IdVoznje + ";" + voznja.Komentar.OcenaVoznje + ";" + voznja.Status + "\n");

            voznje.voznje.Add(voznja);


            string path = "~/App_Data/Voznje.txt";
            path = HostingEnvironment.MapPath(path);

            if (!File.Exists(path))
                File.WriteAllText(path, sb.ToString());
            else
                File.AppendAllText(path, sb.ToString());

            voznje = new Voznje("~/App_Data/Voznje.txt");
            HttpContext.Current.Application["voznje"] = voznje;

            return true;
        }
    }
}