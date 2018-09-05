using System;
using System.Collections.Generic;
using System.IO;
using System.Web.Hosting;

namespace WebAPI.Models
{
	public class Dispeceri
	{
		public List<Dispecer> dispecers { get; set; }

		public Dispeceri() { }

		public Dispeceri(string path)
		{
			path = HostingEnvironment.MapPath(path);
			dispecers = new List<Dispecer>();
			FileStream stream = new FileStream(path, FileMode.Open);
			StreamReader sr = new StreamReader(stream);
			string line = "";
			while ((line = sr.ReadLine()) != null)
			{
				string[] tokens = line.Split(';');
				Dispecer d = new Dispecer(Int32.Parse(tokens[0]), tokens[1], tokens[2], tokens[3], tokens[4], tokens[5], tokens[6], tokens[7], tokens[8], tokens[9], tokens[10]);
				dispecers.Add(d);
			}
			sr.Close();
			stream.Close();
		}
	}
}