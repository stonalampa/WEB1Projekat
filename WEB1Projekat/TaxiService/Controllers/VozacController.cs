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
    public class VozacController : ApiController
    {
        public List<Vozac> Get()
        {
            Vozaci v = (Vozaci)HttpContext.Current.Application["vozaci"];
            return v.vozaci;
        }

        public bool Post([FromBody]Vozac vozac)
        {
            Vozaci v = (Vozaci)HttpContext.Current.Application["vozaci"];
            foreach (var item in v.vozaci)
            {
                if (item.KorisnickoIme == vozac.KorisnickoIme)
                {
                    return false;
                }
            }

            string path = "~/App_Data/Vozaci.txt";
            path = HostingEnvironment.MapPath(path);

            vozac.Id = v.vozaci.Count + 1;

            if (vozac.Automobil.Tip.Equals("PUTNICKI AUTOMOBIL"))
            {
                vozac.Automobil.Tip = TipAutomobila.Tip.PUTNICKIAUTOMOBIL;
            }
            else
            {
                vozac.Automobil.Tip = TipAutomobila.Tip.KOMBIVOZILA;
            }

            string[] dijelovi = vozac.Lokacija.Adresa.NaseljenoMjesto.Split(' ');
            vozac.Lokacija.Adresa.NaseljenoMjesto = null;
            dijelovi = dijelovi.Where(x => !string.IsNullOrEmpty(x)).ToArray();
            int br = 0;
            for (int i = 0; i < dijelovi.Length; i++)
            {
                int n;
                bool isNumeric = Int32.TryParse(dijelovi[i], out n);
                if (isNumeric)
                {
                    vozac.Lokacija.Adresa.PozivniBroj = dijelovi[i];
                    break;
                }
                else
                {
                    if (br > 0)
                    {
                        vozac.Lokacija.Adresa.NaseljenoMjesto += " " + dijelovi[i];
                    }
                    else
                    {
                        vozac.Lokacija.Adresa.NaseljenoMjesto += dijelovi[i];
                        br++;
                    }
                }
            }

            v.vozaci.Add(vozac);
            StringBuilder sb = new StringBuilder();
            sb.Append(vozac.Id + ";" + vozac.KorisnickoIme + ";" + vozac.Lozinka + ";" + vozac.Ime + ";" + vozac.Prezime + ";" + vozac.Pol + ";" + vozac.JMBG + ";" + vozac.Telefon + ";" + vozac.Email + ";" + vozac.Uloga + ";" + vozac.Voznja + ";" + vozac.Lokacija.X + ";" + vozac.Lokacija.Y + ";" + vozac.Lokacija.Adresa.UlicaBroj + ";" + vozac.Lokacija.Adresa.NaseljenoMjesto + ";" + vozac.Lokacija.Adresa.PozivniBroj + ";" + vozac.Automobil.Vozac + ";" + vozac.Automobil.GodisteAutomobila + ";" + vozac.Automobil.BrojRegistarskeOznake + ";" + vozac.Automobil.BrojTaksiVozila + ";" + vozac.Automobil.Tip + ";" + vozac.Zauzet + "\n");

            if (!File.Exists(path))
            {
                File.WriteAllText(path, sb.ToString());
            }
            else
            {
                File.AppendAllText(path, sb.ToString());
            }

            v = new Vozaci(@"~/App_Data/Vozaci.txt");
            HttpContext.Current.Application["vozaci"] = v;
            return true;
        }

        public bool Put(int id, [FromBody]Vozac korisnik)
        {
            Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];
            string path = "~/App_Data/Vozaci.txt";
            path = HostingEnvironment.MapPath(path);
            foreach (var item in vozaci.vozaci)
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
                    item.Lokacija.X = korisnik.Lokacija.X;
                    item.Lokacija.Y = korisnik.Lokacija.Y;
                    item.Lokacija.Adresa.UlicaBroj = korisnik.Lokacija.Adresa.UlicaBroj;

                    string[] dijelovi = korisnik.Lokacija.Adresa.NaseljenoMjesto.Split(' ');
                    korisnik.Lokacija.Adresa.NaseljenoMjesto = null;
                    dijelovi = dijelovi.Where(x => !string.IsNullOrEmpty(x)).ToArray();

                    int br = 0;
                    for (int i = 0; i < dijelovi.Length; i++)
                    {
                        int n;
                        bool isNumeric = Int32.TryParse(dijelovi[i], out n);
                        if (isNumeric)
                        {
                            korisnik.Lokacija.Adresa.PozivniBroj = dijelovi[i];
                            break;
                        }
                        else
                        {
                            if (br > 0)
                            {
                                korisnik.Lokacija.Adresa.NaseljenoMjesto += " " + dijelovi[i];
                            }
                            else
                            {
                                korisnik.Lokacija.Adresa.NaseljenoMjesto += dijelovi[i];
                                br++;
                            }
                        }
                    }

                    item.Lokacija.Adresa.NaseljenoMjesto = korisnik.Lokacija.Adresa.NaseljenoMjesto;
                    item.Lokacija.Adresa.PozivniBroj = korisnik.Lokacija.Adresa.PozivniBroj;
                    item.Automobil.BrojRegistarskeOznake = korisnik.Automobil.BrojRegistarskeOznake;
                    item.Automobil.BrojTaksiVozila = korisnik.Automobil.BrojTaksiVozila;
                    item.Automobil.GodisteAutomobila = korisnik.Automobil.GodisteAutomobila;
                    if (korisnik.Automobil.Tip.Equals("PUTNICKI AUTOMOBIL"))
                        item.Automobil.Tip = TipAutomobila.Tip.PUTNICKIAUTOMOBIL;
                    else
                        item.Automobil.Tip = TipAutomobila.Tip.KOMBIVOZILA;
                    item.Automobil.Vozac = korisnik.Automobil.Vozac;
                    StringBuilder sb = new StringBuilder();
                    sb.Append(item.Id + ";" + item.KorisnickoIme + ";" + item.Lozinka + ";" + item.Ime + ";" + item.Prezime + ";" + item.Pol + ";" + item.JMBG + ";" + item.Telefon + ";" + item.Email + ";" + item.Uloga + ";" + item.Voznja + ";" + item.Lokacija.X + ";" + item.Lokacija.Y + ";" + item.Lokacija.Adresa.UlicaBroj + ";" + item.Lokacija.Adresa.NaseljenoMjesto + ";" + item.Lokacija.Adresa.PozivniBroj + ";" + item.Automobil.Vozac + ";" + item.Automobil.GodisteAutomobila + ";" + item.Automobil.BrojRegistarskeOznake + ";" + item.Automobil.BrojTaksiVozila + ";" + item.Automobil.Tip + ";" + item.Zauzet + "\n");
                    string[] arrLine = File.ReadAllLines(path);
                    arrLine[item.Id - 1] = sb.ToString();
                    File.WriteAllLines(path, arrLine);
                    File.WriteAllLines(path, File.ReadAllLines(path).Where(l => !string.IsNullOrWhiteSpace(l)));

                    vozaci = new Vozaci("~/App_Data/Vozaci.txt");
                    HttpContext.Current.Application["vozaci"] = vozaci;
                    return true;
                }
            }
            return false;
        }

        public bool Put([FromBody]Vozac vozac)  // Vozac mjenja svoju trenutnu lokaciju
        {
            Vozaci vozaci = (Vozaci)HttpContext.Current.Application["vozaci"];
            string path = "~/App_Data/Vozaci.txt";
            path = HostingEnvironment.MapPath(path);
            foreach (var item in vozaci.vozaci)
            {
                if (item.Id == vozac.Id)
                {
                    item.Lokacija.X = vozac.Lokacija.X;
                    item.Lokacija.Y = vozac.Lokacija.Y;
                    item.Lokacija.Adresa.UlicaBroj = vozac.Lokacija.Adresa.UlicaBroj;

                    string[] dijelovi = vozac.Lokacija.Adresa.NaseljenoMjesto.Split(' ');
                    vozac.Lokacija.Adresa.NaseljenoMjesto = null;
                    dijelovi = dijelovi.Where(x => !string.IsNullOrEmpty(x)).ToArray();

                    int br = 0;
                    for (int i = 0; i < dijelovi.Length; i++)
                    {
                        int n;
                        bool isNumeric = Int32.TryParse(dijelovi[i], out n);
                        if (isNumeric)
                        {
                            vozac.Lokacija.Adresa.PozivniBroj = dijelovi[i];
                            break;
                        }
                        else
                        {
                            if (br > 0)
                            {
                                vozac.Lokacija.Adresa.NaseljenoMjesto += " " + dijelovi[i];
                            }
                            else
                            {
                                vozac.Lokacija.Adresa.NaseljenoMjesto += dijelovi[i];
                                br++;
                            }
                        }
                    }

                    item.Lokacija.Adresa.NaseljenoMjesto = vozac.Lokacija.Adresa.NaseljenoMjesto;
                    item.Lokacija.Adresa.PozivniBroj = vozac.Lokacija.Adresa.PozivniBroj;
                    StringBuilder sb = new StringBuilder();
                    sb.Append(item.Id + ";" + item.KorisnickoIme + ";" + item.Lozinka + ";" + item.Ime + ";" + item.Prezime + ";" + item.Pol + ";" + item.JMBG + ";" + item.Telefon + ";" + item.Email + ";" + item.Uloga + ";" + item.Voznja + ";" + item.Lokacija.X + ";" + item.Lokacija.Y + ";" + item.Lokacija.Adresa.UlicaBroj + ";" + item.Lokacija.Adresa.NaseljenoMjesto + ";" + item.Lokacija.Adresa.PozivniBroj + ";" + item.Automobil.Vozac + ";" + item.Automobil.GodisteAutomobila + ";" + item.Automobil.BrojRegistarskeOznake + ";" + item.Automobil.BrojTaksiVozila + ";" + item.Automobil.Tip + ";" + item.Zauzet + "\n");
                    string[] arrLine = File.ReadAllLines(path);
                    arrLine[item.Id - 1] = sb.ToString();
                    File.WriteAllLines(path, arrLine);
                    File.WriteAllLines(path, File.ReadAllLines(path).Where(l => !string.IsNullOrWhiteSpace(l)));
                    vozaci = new Vozaci("~/App_Data/Vozaci.txt");
                    HttpContext.Current.Application["vozaci"] = vozaci;
                    return true;
                }
            }
            return false;
        }
    }
}