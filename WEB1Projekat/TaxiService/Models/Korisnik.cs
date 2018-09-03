using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static TaxiService.Models.Polovi;
using static TaxiService.Models.Uloga;

namespace TaxiService.Models
{
    public class Korisnik
    {
        public int Id { get; set; }
        public string KorisnickoIme { get; set; }
        public string Lozinka { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public Pol Pol { get; set; }
        public string JMBG { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public Uloge Uloga { get; set; }
        public string Voznja { get; set; }

        public Korisnik(int Id, string KorisnickoIme, string Lozinka, string Ime, string Prezime, string pol, string Jmbg, string Telefon, string email, string uloga, string voznja)
        {
            this.Id = Id;
            this.KorisnickoIme = KorisnickoIme;
            this.Lozinka = Lozinka;
            this.Ime = Ime;
            this.Prezime = Prezime;
            if (pol.Equals("MUSKI"))
            {
                this.Pol = Pol.MUSKI;
            }
            else
            {
                this.Pol = Pol.ZENSKI;
            }
            this.JMBG = Jmbg;
            this.Telefon = Telefon;
            this.Email = email;

            if (uloga.Equals("MUSTERIJA"))
            {
                this.Uloga = Uloge.MUSTERIJA;
            }
            else if (uloga.Equals("DISPECER"))
            {
                this.Uloga = Uloge.DISPECER;
            }
            else
            {
                this.Uloga = Uloge.VOZAC;
            }

            this.Voznja = voznja;
        }

        public Korisnik() { }
    }
}