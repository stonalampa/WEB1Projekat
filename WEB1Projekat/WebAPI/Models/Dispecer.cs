namespace WebAPI.Models
{
	public class Dispecer : Korisnik
	{
		public Dispecer() : base() { }

		public Dispecer(int Id, string KorisnickoIme, string Lozinka, string Ime, string Prezime, string pol, string Jmbg, string Telefon, string email, string uloga, string voznja) : base(Id, KorisnickoIme, Lozinka, Ime, Prezime, pol, Jmbg, Telefon, email, uloga, voznja)
		{

		}
	}
}