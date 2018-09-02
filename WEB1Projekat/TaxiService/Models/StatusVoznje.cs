using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaxiService.Models
{
    public class StatusVoznje
    {
        public enum Status { KREIRANA_NA_CEKANJU, FORMIRANA, OBRADJENA, PRIHVACENA, OTKAZANA, NEUSPESNA, USPESNA }
    }
}