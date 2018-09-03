﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static TaxiService.Models.TipAutomobila;

namespace TaxiService.Models
{
    public class Automobil
    {
        public Automobil() { }
        public Automobil(string v, string g, string b, string bt, string t)
        {
            Vozac = v;
            GodisteAutomobila = g;
            BrojRegistarskeOznake = b;
            BrojTaksiVozila = bt;
            if (t.Equals("PUTNICKIAUTOMOBIL"))
            {
                this.Tip = Tip.PUTNICKIAUTOMOBIL;
            }
            else
            {
                this.Tip = Tip.KOMBIVOZILA;
            }
        }
        public string Vozac { get; set; }
        public string GodisteAutomobila { get; set; }
        public string BrojRegistarskeOznake { get; set; }
        public string BrojTaksiVozila { get; set; }
        public Tip Tip { get; set; }
    }
}