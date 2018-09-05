using System;
using static WebAPI.Models.TipAutomobila;
using static WebAPI.Models.StatusVoznje;

namespace WebAPI.Models
{
    public class Voznja
    {
        public Voznja() { }

        public Voznja(string IdVoznje, string DatumVreme, string X, string Y, string UlicaBroj, string NaseljenoMesto, string PozivniBroj, string TipAutomobila, string IdMusterije, string XOdrediste, string YOdrediste, string UlicaBrojOdrediste, string NaseljenoMestoOdrediste, string PozivniBrojOdrediste, string IdDispecera, string IdVozaca, string Iznos, string OpisKomentara, string DatumKomentara, string KorisnickoImeOnogKoPraviKomentar, string Idvoznje, string Ocena, string StatusV)
        {
            this.IdVoznje = Int32.Parse(IdVoznje);
            this.VremePorudzbine = DateTime.Parse(DatumVreme);
            Lokacija = new Lokacija(X, Y, UlicaBroj, NaseljenoMesto, PozivniBroj);

            if (TipAutomobila.Equals("PUTNICKIAUTOMOBIL"))
            {
                Automobil = Tip.PUTNICKIAUTOMOBIL;
            }
            else
            {
                Automobil = Tip.KOMBIVOZILA;
            }

            Musterija = IdMusterije;
            Odrediste = new Lokacija(XOdrediste, YOdrediste, UlicaBrojOdrediste, NaseljenoMestoOdrediste, PozivniBrojOdrediste);
            Dispecer = IdDispecera;
            Vozac = IdVozaca;
            this.Iznos = double.Parse(Iznos);
            Komentar = new Komentar(OpisKomentara, DatumKomentara, KorisnickoImeOnogKoPraviKomentar, Idvoznje, Ocena);
            if (StatusV.Equals("KREIRANA_NA_CEKANJU"))
            {
                this.Status = Status.KREIRANA_NA_CEKANJU;
            }
            else if (StatusV.Equals("FORMIRANA"))
            {
                this.Status = Status.FORMIRANA;
            }
            else if (StatusV.Equals("OBRADJENA"))
            {
                this.Status = Status.OBRADJENA;
            }
            else if (StatusV.Equals("PRIHVACENA"))
            {
                this.Status = Status.PRIHVACENA;
            }
            else if (StatusV.Equals("OTKAZANA"))
            {
                this.Status = Status.OTKAZANA;
            }
            else if (StatusV.Equals("NEUSPESNA"))
            {
                this.Status = Status.NEUSPESNA;
            }
            else if (StatusV.Equals("USPESNA"))
            {
                this.Status = Status.USPESNA;
            }
            
        }
        public int IdVoznje { get; set; }
        public DateTime VremePorudzbine { get; set; }
        public Lokacija Lokacija { get; set; }
        public Tip Automobil { get; set; }
        public string Musterija { get; set; }
        public Lokacija Odrediste { get; set; }
        public string Dispecer { get; set; }
        public string Vozac { get; set; }
        public double Iznos { get; set; }
        public Komentar Komentar { get; set; }
        public Status Status { get; set; }
    }
}