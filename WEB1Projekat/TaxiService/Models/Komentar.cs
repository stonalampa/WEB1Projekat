using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Komentar
    {
        public Komentar() { }
        public Komentar(string Opis, string DatumObjave, string KorisnickoIme, string IdVoznje, string Ocena)
        {
            this.Opis = Opis;
            this.DatumObjave = DateTime.Parse(DatumObjave);
            this.KorisnickoIme = KorisnickoIme;
            this.IdVoznje = Int32.Parse(IdVoznje);
            OcenaVoznje = Int32.Parse(Ocena);
        }
        public string Opis { get; set; }
        public DateTime DatumObjave { get; set; }
        public string KorisnickoIme { get; set; }
        public int OcenaVoznje { get; set; }
        public int IdVoznje { get; set; }
    }
}