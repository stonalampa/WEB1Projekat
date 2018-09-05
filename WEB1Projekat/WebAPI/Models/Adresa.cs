namespace WebAPI.Models
{
	public class Adresa
	{
		public Adresa() { }
		public Adresa(string ub, string nm, string pb)
		{
			UlicaBroj = ub;
			NaseljenoMjesto = nm;
			PozivniBroj = pb;
		}
		public string UlicaBroj { get; set; }
		public string NaseljenoMjesto { get; set; }
		public string PozivniBroj { get; set; }
	}
}