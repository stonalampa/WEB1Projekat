using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class Lokacija
    {
        public Lokacija() { }
        public Lokacija(string x, string y, string ub, string nm, string pb)
        {
            X = x;
            Y = y;
            Adresa = new Adresa(ub, nm, pb);
        }
        public string X { get; set; }
        public string Y { get; set; }
        public Adresa Adresa { get; set; }
    }
}