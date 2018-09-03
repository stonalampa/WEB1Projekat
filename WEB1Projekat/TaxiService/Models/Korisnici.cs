using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace TaxiService.Models
{
    public class Korisnici
    {
        public List<Korisnik> korisnici { get; set; }

        public Korisnici() { }

        public Korisnici(string path)
        {
            path = HostingEnvironment.MapPath(path);
            korisnici = new List<Korisnik>();
            FileStream stream = new FileStream(path, FileMode.Open);
            StreamReader sr = new StreamReader(stream);
            string line = "";
            while ((line = sr.ReadLine()) != null)
            {
                string[] tokens = line.Split(';');
                Korisnik k = new Korisnik(Int32.Parse(tokens[0]), tokens[1], tokens[2], tokens[3], tokens[4], tokens[5], tokens[6], tokens[7], tokens[8], tokens[9], tokens[10]);
                korisnici.Add(k);
            }
            sr.Close();
            stream.Close();
        }
    }
}