$(document).ready(function () {
    let korisnik;
    let korisnickoIme = localStorage.getItem("Ulogovan");

    $('#zaprofil').hide();
    $('#zaizmenu').hide();
    $('#divDodajVoznju').hide();
    $('#divIzmeniVoznju').hide();
    $('#divOtkaziVoznju').hide();
    $('#map1').hide();
    $('#divKomentarisiVoznju').hide();
    $('#PretraziKorisnikdiv').hide();

    $('#zaprofilDispecer').hide();
    $('#zaizmenuDispecer').hide();

    $('#zadodajVozaca').hide();
    $('#zadodajVoznju').hide();

    $('#zaprofilVozaca').hide();
    $('#zaizmenuVozaca').hide();
    $('#promenaLokacijeVozaca').hide();

    function vratiStatusVoznje(id) {
        switch (id) {
            case 0: return "Kreirana";
            case 1: return "Formirana";
            case 2: return "Obradjena";
            case 3: return "Prihvaćena";
            case 4: return "Otkazana";
            case 5: return "Neuspešna";
            case 6: return "Uspešna";
        }
    }

    let Korisnik = {
        KorisnickoIme: `${korisnickoIme}`
    };

    $.ajax({
        type: 'POST',
        url: '/api/Wellcome',
        data: JSON.stringify(Korisnik),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
            //alert('Sifra je: ' + data.Lozinka);
            korisnik = data;
            if (korisnik.Uloga == 2) {
                $('#dispecer').hide();
                $('#vozac').hide();
                $('#musterija').show();
                $.get("/api/Voznja", function (data, status) {
                    let table = "<table border=\"1\">";
                    table += "<tr><th>ID voznje</th><th>Datum</th><th>Mesto polaska</th><th>Tip automobila</th><th>Odrediste</th><th>Iznos</th><th>Komentar</th><th>Status voznje</th><th>Opcije</th></tr>";

                    for (voznja in data) {
                        if (data[voznja].Musterija == localStorage.getItem("Ulogovan")) {
                            table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                            switch (data[voznja].Automobil) {
                                case 0:
                                    table += "Putnicki automobil";
                                    break;
                                case 1:
                                    table += "Kombi vozilo";
                                    break;
                            }
                            table += "</td>";

                            if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                table += ("<td>/</td>");
                            }
                            else {
                                table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                            }

                            if (data[voznja].Iznos != "0") {
                                table += ("<td>" + data[voznja].Iznos + "</td>");
                            }
                            else {
                                table += ("<td>/</td>");
                            }

                            table += ('<td><textarea rows="5" cols="30" disabled>');

                            if (data[voznja].Komentar.Opis == "") {
                                table += ("Komentar nije dodat!" + "</textarea></td>");
                            } else {
                                table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                            }

                            if (data[voznja].Status == 0) {
                                table += '<td>Kreirana</td>';
                            } else if (data[voznja].Status == 1) {
                                table += '<td>Formirana</td>';
                            } else if (data[voznja].Status == 2) {
                                table += '<td>Obradjena</td>';
                            } else if (data[voznja].Status == 3) {
                                table += '<td>Prihvacena</td>';
                            } else if (data[voznja].Status == 4) {
                                table += '<td>Otkazana</td>';
                            } else if (data[voznja].Status == 5) {
                                table += '<td>Neuspjesna</td>';
                            } else if (data[voznja].Status == 6) {
                                table += '<td>Uspjesna</td>';
                            }
                            table += "<td>";
                            if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                            } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                            } else {
                                table += ("Nedostupne");
                            }
                            table += "</td></tr>";
                        }
                    }
                    table += "</table>";

                    $('#PrikazKorisnik').html(table);
                });
            } else if (korisnik.Uloga == 1) {
                $('#musterija').hide();
                $('#dispecer').show();
                $('#vozac').hide();
                $.get("/api/Voznja", function (data, status) {
                    let table = "<table border=\"1\">";
                    table += '<table border=1><tr><th>Id vožnje</th><th>Datum</th><th>Mušterija</th><th>Vozač</th><th >Mesto polaska</th><th>Tip auta</th><th>Ordedište</th><th>Iznos</th><th>Komentar</th><th>Status vožnje</th></tr>';

                    for (voznja in data) {
                        if (data[voznja].Dispecer == localStorage.getItem("Ulogovan")) {
                            table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td>");

                            if (data[voznja].Musterija == "") {
                                table += '<td>/</td>';
                            } else {
                                table += ('<td>' + data[voznja].Musterija + '</td>');
                            }

                            if (data[voznja].Vozac == "") {
                                table += '<td>/</td>';
                            } else {
                                table += ('<td>' + data[voznja].Vozac + '</td>');
                            }

                            table += ('<td>' + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + " " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");

                            switch (data[voznja].Automobil) {
                                case 0:
                                    table += "Putnički";
                                    break;
                                case 1:
                                    table += "Kombi";
                                    break;
                            }


                            if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                table += ("</td><td>/" + "</td>");
                            }
                            else {
                                table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                            }

                            if (data[voznja].Iznos != "0") {
                                table += ("<td>" + data[voznja].Iznos + "</td>");
                            } else {
                                table += ("<td>/</td>");
                            }

                            table += ('<td><textarea rows="5" cols="30" disabled>');

                            if (data[voznja].Komentar.Opis == "") {
                                table += ("Komentar nije dodat!" + "</textarea ></td >");
                            } else {
                                table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                            }

                            table += ("<td>" + vratiStatusVoznje(data[voznja].Status) + "</td> <td>");


                            /*if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                table += (`<button value=${data[voznja].IdVoznje} id="obradi">Obradi</button><br /><br />`);
                            } else {
                                table += ("Nedostupne");
                            }*/
                            table += (`</td></tr>`)

                        }
                    }
                    table += '</table>';

                    $('#PrikazDispecer').append(table);
                });
            }
            else {
                $('#musterija').hide();
                $('#dispecer').hide();
                $('#vozac').show();
                $.get("/api/Voznja", function (data, status) {
                    let tableOfProducts = "<table border='1'>";
                    tableOfProducts += `<tr><th>Mušterija vožnje</th><th>Datum porudžbine</th><th>Ulica i br. dolaska</th><th>Mjesto dol.</th><th>Pozivni br. dol.</th><th>Status vož.</th><th>Opis kom.</th><th>Ocjena kom.</th><th>Dat. obj. kom. vož.</th><th> </th><th> </th></tr>`;
                    for (voznja in data) {
                        if (localStorage.getItem("Ulogovan") == data[voznja].Vozac) {
                            tableOfProducts += `<tr><td>${data[voznja].Musterija}</td><td>${data[voznja].VremePorudzbine}</td><td>${data[voznja].Odrediste.Adresa.UlicaBroj}</td><td>${data[voznja].Odrediste.Adresa.NaseljenoMjesto}</td><td>${data[voznja].Odrediste.Adresa.PozivniBroj}</td>`;
                            if (data[voznja].Status == 0) {
                                tableOfProducts += '<td>Kreirana</td>';
                            } else if (data[voznja].Status == 1) {
                                tableOfProducts += '<td>Formirana</td>';
                            } else if (data[voznja].Status == 2) {
                                tableOfProducts += '<td>Obradjena</td>';
                            } else if (data[voznja].Status == 3) {
                                tableOfProducts += '<td>Prihvacena</td>';
                            } else if (data[voznja].Status == 4) {
                                tableOfProducts += '<td>Otkazana</td>';
                            } else if (data[voznja].Status == 5) {
                                tableOfProducts += '<td>Neuspjesna</td>';
                            } else if (data[voznja].Status == 6) {
                                tableOfProducts += '<td>Uspjesna</td>';
                            }
                            if (data[voznja].Status == 0 || data[voznja].Status == 1 || data[voznja].Status == 2) {
                                tableOfProducts += `<td>${data[voznja].Komentar.Opis}</td><td>${data[voznja].Komentar.OcenaVoznje}</td><td>${data[voznja].Komentar.DatumObjave}</td><td><button id="uspjesnaVoznja" type="button" value=${data[voznja].IdVoznje}><b>Uspjesna voznja</b></button></td><td><button id="neuspjesnaVoznjaKomentar" type="button" value=${data[voznja].IdVoznje}><b>Neuspjesna voznja</b></button></td></tr>`;
                            } else if (data[voznja].StatusVoznje == 4 || data[voznja].StatusVoznje == 5) {
                                tableOfProducts += `<td>${data[voznja].Komentar.Opis}</td><td>${data[voznja].Komentar.OcenaVoznje}</td><td>${data[voznja].Komentar.DatumObjave}</td><td><button id="uspjesnaVoznja" type="button" value ="disable" disabled="disabled"><b>Uspjesna voznja</b></button></td><td><button id="neuspjesnaVoznjaKomentar" type="button" value ="disable" disabled="disabled"><b>Neuspjesna voznja</b></button></td></tr>`;
                            } else {
                            }//<td><button id="prihvatiVoznju" type="button" value=${data[voznja].IdVoznje}><b>Prihvati voznju</b></button></td> //<td><button id="prihvatiVoznju" type="button" value ="disable" disabled="disabled"><b>Prihvati voznju</b></button></td>
                        }
                    }
                    tableOfProducts += "</table>";
                    $("#PrikaziVoznjeVozac").html(tableOfProducts);

                });
            }
        }
    })

    //Dodavanje komentara na uspjesnu voznju iz musterije
    let idZaUspjesno;
    $(document).on('click', '#UspesanKomentar', function () {
        idZaUspjesno = $(this).val();
        $('#PrikazKorisnik').hide();
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#map1').hide();
        $('#divDodajVoznju').hide();
        $('#divIzmeniVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divKomentarisiVoznju').show();
    })

    $('#KomentarisiKorisnik').click(function () {
        let id = `${$('#UspesanKomentar').val()}`;
        let komentar = {
            Opis: `${$('#OpisKorisnikKomentar').val()}`,
            OcenaVoznje: `${$('#OcenaVoznjeKorisnikKomentar').val()}`,
            KorisnickoIme: localStorage.getItem("Ulogovan")
        };

        let KomentarisiVoznju = {
            Komentar: komentar,
            Musterija: localStorage.getItem("Ulogovan"),
        };

        $.ajax({
            type: 'PUT',
            url: '/api/Voznja/PutUspesnaKomentar/' + idZaUspjesno,
            data: JSON.stringify(KomentarisiVoznju),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (!data) {
                    alert("Vožnja nije komentarisana!");
                } else {
                    alert("Uspešno ste komentarisali vožnju!");
                    $(location).attr('href', 'wellcome.html');
                }
            }
        })
    })

    // Odustani od voznje iz korisnika


    $(document).on('click', '#odustani', function () {
        $('#PrikazKorisnik').hide();
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#map1').hide();
        $('#divDodajVoznju').hide();
        $('#divIzmeniVoznju').hide();
        $('#divKomentarisiVoznju').hide();
        $('#divOtkaziVoznju').toggle(500);
    });

    $('#OtkaziKorisnik').click(function () {
        let id = `${$('#odustani').val()}`;
        let komentar = {
            Opis: `${$('#OpisKorisnik').val()}`,
            OcenaVoznje: `${$('#OcenaVoznjeKorisnik').val()}`
        };

        let OtkaziVoznju = {
            Komentar: komentar,
            Musterija: localStorage.getItem("Ulogovan")
        };

        $.ajax({
            type: 'PUT',
            url: '/api/Voznja/PutOtkaz/' + id,
            data: JSON.stringify(OtkaziVoznju),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (!data) {
                    alert("Vožnja nije otkazana!");
                } else {
                    alert("Uspešno ste otkazali vožnju!");
                    $(location).attr('href', 'wellcome.html');
                }
            }
        })
    })

    $(document).on('click', '#izmeniV', function () {
        $('#PrikazKorisnik').hide();
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#map1').show();
        $('#divDodajVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divKomentarisiVoznju').hide();
        $('#divIzmeniVoznju').toggle(500);
    });

    $('#IzmeniVoznju').click(function () {
        let niz = fulAdresa.split(",");

        let id = `${$('#izmeniV').val()}`;
        let tip = `${$('#TipVozilaIzmena').val()}`;
        if (tip == "KOMBI VOZILO") {
            tip = "KOMBIVOZILA";
        }

        let adresa = {
            UlicaBroj: `${niz[2]}`,
            NaseljenoMjesto: `${niz[3]}`,
            PozivniBroj: `${''}`
        };

        let lokacija = {
            X: `${niz[0]}`,
            Y: `${niz[1]}`,
            Adresa: adresa
        };

        let NovaVoznjaKorisnika = {
            Lokacija: lokacija,
            Automobil: tip,
        }

        $.ajax({
            type: 'PUT',
            url: '/api/Voznja/Put/' + id,
            data: JSON.stringify(NovaVoznjaKorisnika),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (!data) {
                    alert("Vožnja nije izmenjena!");
                } else {
                    alert("Uspešno ste izmenili vožnju!");
                    $(location).attr('href', 'wellcome.html');
                }
            }
        })
    })

    // Kraj odustani od voznje iz korisnika

    $('#profilDispecer').click(function () {
        $('#zaizmenuDispecer').hide();

        $('#PrikazDispecerSve').hide();
        $('#zadodajVoznju').hide();
        $('#map1').hide();
        $('#PrikazDispecer').hide();

        $('#zadodajVozaca').hide();
        $('#1D').text(korisnik.KorisnickoIme);
        $('#2D').text(korisnik.Lozinka);
        $('#3D').text(korisnik.Ime);
        $('#4D').text(korisnik.Prezime);
        $('#5D').text(korisnik.JMBG);
        if (korisnik.Pol == 1) {
            $('#6D').text("Zenski");
        } else {
            $('#6D').text("Muski");
        }
        $('#7D').text(korisnik.Telefon);
        $('#8D').text(korisnik.Email);
        $('#zaprofilDispecer').toggle(500);
    })

    $('#izmeniDispecer').click(function () {
        $('#zaprofilDispecer').hide();

        $('#PrikazDispecerSve').hide();
        $('#zadodajVoznju').hide();
        $('#map1').hide();
        $('#PrikazDispecer').hide();

        $('#zadodajVozaca').hide();
        $('#zaizmenuDispecer').toggle(500);
    })

    $('#IzmeniDispecer').click(function () {
        let dispecerIzmena = {
            Id: korisnik.Id,
            KorisnickoIme: `${$('#KorisnickoImeD').val()}`,
            Lozinka: `${$('#LozinkaD').val()}`,
            Ime: `${$('#ImeD').val()}`,
            Prezime: `${$('#PrezimeD').val()}`,
            Pol: korisnik.Pol,
            JMBG: `${$('#JMBGD').val()}`,
            Telefon: `${$('#TelefonD').val()}`,
            Email: `${$('#EmailD').val()}`,
            Uloga: 'DISPECER',
            Voznja: "nema voznje",
        };


        $.ajax({
            type: 'PUT',
            url: '/api/Dispecer/' + korisnik.Id,
            data: JSON.stringify(dispecerIzmena),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    localStorage.setItem("Ulogovan", dispecerIzmena.KorisnickoIme);
                    alert('Data was succesfully captured');
                    $(location).attr('href', 'wellcome.html');
                }
                else {
                    alert('Error');
                }
            }
        })
    })

    $('#odjaviDispecer').click(function () {
        localStorage.setItem("Ulogovan", null);
        $(location).attr('href', 'index.html');
    })

    $('#profil').click(function () {
        $('#zaizmenu').hide();
        $('#map1').hide();
        $('#divDodajVoznju').hide();
        $('#divIzmeniVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divKomentarisiVoznju').hide();
        $('#PrikazKorisnik').hide();
        $('#map1').hide();
        $('#1').text(korisnik.KorisnickoIme);
        $('#2').text(korisnik.Lozinka);
        $('#3').text(korisnik.Ime);
        $('#4').text(korisnik.Prezime);
        $('#5').text(korisnik.JMBG);
        if (korisnik.Pol == 1) {
            $('#6').text("Zenski");
        } else {
            $('#6').text("Muski");
        }
        $('#7').text(korisnik.Telefon);
        $('#8').text(korisnik.Email);
        $('#zaprofil').toggle(500);
    })

    $('#izmeni').click(function () {
        $('#zaprofil').hide();
        $('#divKomentarisiVoznju').hide();
        $('#PrikazKorisnik').hide();
        $('#divIzmeniVoznju').hide();
        $('divDodajVoznju').hide();
        $('divOtkaziVoznju').hide();
        $('#map1').hide();
        $('#zaizmenu').toggle(500);
    })

    $('#Izmeni').click(function () {
        let korisnikIzmena = {
            Id: korisnik.Id,
            KorisnickoIme: `${$('#KorisnickoIme').val()}`,
            Lozinka: `${$('#Lozinka').val()}`,
            Ime: `${$('#Ime').val()}`,
            Prezime: `${$('#Prezime').val()}`,
            Pol: korisnik.Pol,
            JMBG: `${$('#JMBG').val()}`,
            Telefon: `${$('#Telefon').val()}`,
            Email: `${$('#Email').val()}`,
            Uloga: 'MUSTERIJA',
            Voznja: "nema voznje",
        };


        $.ajax({
            type: 'PUT',
            url: '/api/Korisnik/' + korisnik.Id,
            data: JSON.stringify(korisnikIzmena),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    localStorage.setItem("Ulogovan", korisnikIzmena.KorisnickoIme);
                    alert('Data was succesfully captured');
                    $(location).attr('href', 'wellcome.html');
                }
                else {
                    alert('Error');
                }
            }
        })
    })

    $('#odjavi').click(function () {
        localStorage.setItem("Ulogovan", null);
        $(location).attr('href', 'index.html');
    })

    // Prikaz svih voznji iz dispecera

    $('#DispecerSveVoznje').click(function () {
        $('#PrikazDispecer').hide();

        $('#zaprofilDispecer').hide();
        $('#zaizmenuDispecer').hide();
        $('#zadodajVozaca').hide();
        $('#zadodajVoznju').hide();
        $('#map1').hide();

        $('#PrikazDispecerSve').show();
        $.get("/api/Voznja", function (data, status) {
            let tableOfProducts = "<table border='1'>";
            tableOfProducts += `<tr><th>Tip auta</th><th>Mušterija vožnje</th><th>Datum porudž.</th><th>Ulica i br. dolaska</th><th>Mjesto dol.</th><th>Pozivni br. dol.</th><th>Status vož.</th><th>Vozač</th><th>Opis kom.</th><th>Ocjena kom.</th><th>Dat. obj. kom. vož.</th></tr>`;
            for (voznja in data) {
                if (data[voznja].Automobil == 0) {
                    tableOfProducts += '<tr><td>Putnički</td>';
                }
                else {
                    tableOfProducts += '<tr><td>Kombi</td>';
                }
                tableOfProducts += `<td>${data[voznja].Musterija}</td><td>${data[voznja].VremePorudzbine}</td><td>${data[voznja].Odrediste.Adresa.UlicaBroj}</td><td>${data[voznja].Odrediste.Adresa.NaseljenoMjesto}</td><td>${data[voznja].Odrediste.Adresa.PozivniBroj}</td>`;
                if (data[voznja].Status == 0) {
                    tableOfProducts += '<td>Kreirana</td>';
                } else if (data[voznja].Status == 1) {
                    tableOfProducts += '<td>Formirana</td>';
                } else if (data[voznja].Status == 2) {
                    tableOfProducts += '<td>Obradjena</td>';
                } else if (data[voznja].Status == 3) {
                    tableOfProducts += '<td>Prihvacena</td>';
                } else if (data[voznja].Status == 4) {
                    tableOfProducts += '<td>Otkazana</td>';
                } else if (data[voznja].Status == 5) {
                    tableOfProducts += '<td>Neuspjesna</td>';
                } else if (data[voznja].Status == 6) {
                    tableOfProducts += '<td>Uspjesna</td>';
                }
                if ((data[voznja].Status == 0 && data[voznja].Vozac == "") || (data[voznja].Status == 0 && data[voznja].Vozac == null)) {
                    tableOfProducts += `<td>${data[voznja].Vozac}</td><td>${data[voznja].Komentar.Opis}</td><td>${data[voznja].Komentar.OcenaVoznje}</td><td>${data[voznja].Komentar.DatumObjave}</td><td><button id="dispecerDodajVozaca" type="button" value=${data[voznja].IdVoznje}><b>Dodaj vozaca</b></button></td></tr>`;
                } else {
                    tableOfProducts += `<td>${data[voznja].Vozac}</td><td>${data[voznja].Komentar.Opis}</td><td>${data[voznja].Komentar.OcenaVoznje}</td><td>${data[voznja].Komentar.DatumObjave}</td><td><button id="dispecerDodajVozaca" type="button" value ="disable" disabled="disabled"><b>Dodaj vozaca</b></button></td></tr>`;
                }

            }
            tableOfProducts += "</table>";
            tableOfProducts += `<tr><td><select id="filterStatusDispSveCombo" name="StatusVoznje"><option value="Kreirana">Kreirana</option><option value="Formirana">Formirana</option><option value="Obradjena">Obradjena</option><option value="Prihvacena">Prihvacena</option><option value="Otkazana">Otkazana</option><option value="Neuspjesna">Neuspjesna</option><option value="Uspjesna">Uspjesna</option></select></td></tr></table><button id="filterStatusDispSveButton" type="button"><b>Filtriraj</b></button>`;
            $("#PrikazDispecerSve").html(tableOfProducts);
        });

    });

    //Kraj

    $(document).on('click', '#dispecerDodajVozaca', function () {  // za dispecera
        let fired_button2 = $(this).val();

        localStorage.setItem("dodajVozaca", fired_button2);
        let type;
        $.get("/api/Voznja", function (data, status) {
            for (voznja in data) {
                if (data[voznja].IdVoznje == fired_button2) {
                    type = data[voznja].Automobil;
                }
            }
        });
        $.get("/api/Vozac", function (data, status) {
            let pom = type;
            let koliko = 0;
            let table = "<table border='1'><tr><td><select id=\"vozac1\" name=\"VozacVoznja\"> ";
            for (driver in data) {
                if (data[driver].Automobil.Tip == pom && data[driver].Zauzet == false) {
                    table += "<option>" + data[driver].KorisnickoIme + "</option>";
                    koliko++;
                }

            }
            table += "</select></td></tr></table><button id=\"dispecerDodajVozaca2\" type=\"button\"><b>Dodaj voznju</b></button>";

            if (koliko == 0) {
                alert('Trenutno nema slobodnih vozača sa traženim automobilom.');
                $(location).attr('href', 'wellcome.html');
            } else {
                $("#PrikazDispecerSve").append(table);
            }

        });
    });

    $(document).on('click', '#dispecerDodajVozaca2', function () {
        let id3 = localStorage.getItem("dodajVozaca");
        //$("#PrikaziVoznjeDispecerSve").hide();
        //$("#PrikaziVoznjeDispecer").hide();
        //$("#DodavanjeVoznjeMusterija").hide();
        //$("#IzmjenaKorisnik1").hide();
        //$("#PrikazKorisnik1").hide();
        //$("#DodajVozacaDispecer").hide();

        let voznja = {
            Vozac: `${$('#vozac1').val()}`,
            Iznos: 0,
            Dispecer: localStorage.getItem("Ulogovan"),
            Status: "OBRADJENA",
        };
        $.ajax({
            type: 'PUT',
            url: '/api/Voznja/PutVozac/' + id3,
            data: JSON.stringify(voznja),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    alert('Uspjesno dodat vozac');
                    localStorage.setItem("dodajVozaca", id3);
                    $(location).attr('href', 'wellcome.html');
                } else {
                    alert('Ne postoji vozac sa zeljenim tipom automobila');
                }
            },
        })
    });

    // Kraj prikaza svih voznji iz dispecera

    $('#DodajVozaca').click(function () {
        let niz = fulAdresa.split(",");

        let adresa = {
            UlicaBroj: `${niz[2]}`,
            NaseljenoMjesto: `${niz[3]}`,
            PozivniBroj: `${''}`
        };

        let lokacija = {
            X: `${niz[0]}`,
            Y: `${niz[1]}`,
            Adresa: adresa
        };


        let automobil = {
            Vozac: `${$('#KorisnickoImeVozaca').val()}`,
            GodisteAutomobila: `${$('#GodisteAutomobila').val()}`,
            BrojRegistarskeOznake: `${$('#BrojRegistarskeOznake').val()}`,
            BrojTaksiVozila: `${$('#BrojTaksiVozila').val()}`,
            Tip: `${$('#tip').val()}`,
        };

        let vozac = {
            KorisnickoIme: `${$('#KorisnickoImeVozaca').val()}`,
            Lozinka: `${$('#LozinkaVozaca').val()}`,
            Ime: `${$('#ImeVozaca').val()}`,
            Prezime: `${$('#PrezimeVozaca').val()}`,
            Pol: `${$('#PolVozaca').val()}`,
            JMBG: `${$('#JMBGVozaca').val()}`,
            Telefon: `${$('#TelefonVozaca').val()}`,
            Email: `${$('#EmailVozaca').val()}`,
            Uloga: 'VOZAC',
            Voznja: "nema voznje",
            Lokacija: lokacija,
            Automobil: automobil
        };

        $.ajax({
            type: 'POST',
            url: '/api/Vozac/',
            data: JSON.stringify(vozac),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    alert('Data was succesfully captured');
                    $(location).attr('href', 'wellcome.html');
                }
                else {
                    alert('Error');
                }
            }
        })

    })

    $('#dodajVozaca').click(function () {
        $('#zaprofilDispecer').hide();
        $('#zaizmenuDispecer').hide();

        $('#PrikazDispecerSve').hide();
        $('#zadodajVoznju').hide();
        $('#PrikazDispecer').hide();

        $('#map1').show();
        $('#zadodajVozaca').toggle(500);
    })

    // Dodavanje voznje iz dispecera

    $('#dodajVoznju').click(function () {
        $('#zaprofilDispecer').hide();
        $('#zaizmenuDispecer').hide();

        $('#PrikazDispecerSve').hide();
        $('#map1').show();
        $('#PrikazDispecer').hide();

        $('#zadodajVozaca').hide();
        $('#zadodajVoznju').toggle(500);
    })


    $('#dispecerDodajVoznju').click(function () {
        $.get("/api/Vozac", function (data, status) {
            let pom = `${$('#dispecerTipVozila').val()}`
            let pom1;
            let koliko = 0;
            if (pom == "KOMBI VOZILO") {
                pom1 = 1;
            }
            else {
                pom1 = 0;
            }

            let table = "<table border='1'><tr><td><select id=\"vozac\" name=\"VozacVoznja\">";

            for (driver in data) {
                if (data[driver].Automobil.Tip == pom1 && data[driver].Zauzet == false) {
                    table += "<option>" + data[driver].KorisnickoIme + "</option>";
                    koliko++;
                }
            }

            table += "</select></td></tr></table><button id=\"dodajVoznjuDispecer2\" type=\"button\"><b>Dodaj voznju</b></button>";
            if (koliko == 0) {
                alert('Trenutno nema slobodnih vozaca sa trazenim automobilom');
                $(location).attr('href', 'wellcome.html');
            } else {
                $("#zadodajVoznju").append(table);
            }
        });
    });

    $(document).on('click', '#dodajVoznjuDispecer2', function () {

        let niz = fulAdresa.split(",");

        $("#DodavanjeVoznjeDispecer").show();
        let pom = `${$('#vozac').val()}`;
        localStorage.setItem("Vozac", pom);
        let pomAuto = `${$('#dispecerTipVozila').val()}`;
        let auto;
        if (pomAuto == "KOMBI VOZILO")
            auto = "KOMBIVOZILA";
        else
            auto = "PUTNICKIAUTOMOBIL";

        let adresa = {
            UlicaBroj: `${niz[2]}`,
            NaseljenoMjesto: `${niz[3]}`,
            PozivniBroj: `${''}`
        };

        let lokacija = {
            X: `${niz[0]}`,
            Y: `${niz[1]}`,
            Adresa: adresa
        };

        let NovaVoznjaDispecera = {
            Lokacija: lokacija,
            Automobil: auto,
            Vozac: localStorage.getItem("Vozac"),
            Dispecer: localStorage.getItem("Ulogovan"),
        }

        $.ajax({
            type: 'POST',
            url: '/api/Dispecer/PostD',
            data: JSON.stringify(NovaVoznjaDispecera),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (!data) {
                    alert("Vožnja nije dodata!");
                } else {
                    alert("Uspešno ste dodali novu vožnju!");
                    $(location).attr('href', 'wellcome.html');
                }
            }
        })
    });

    // Dodavanje Voznje iz korisnika

    $('#dodajVoznjuKorisnik').click(function () {
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#PrikazKorisnik').hide();

        $('#divIzmeniVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divKomentarisiVoznju').hide();

        $('#divDodajVoznju').toggle(500);
        $('#map1').show();
    })

    $('#DodajVoznju').click(function () {
        let niz = fulAdresa.split(",");

        let adresa = {
            UlicaBroj: `${niz[2]}`,
            NaseljenoMjesto: `${niz[3]}`,
            PozivniBroj: `${''}`
        };

        let lokacija = {
            X: `${niz[0]}`,
            Y: `${niz[1]}`,
            Adresa: adresa
        };

        let NovaVoznjaKorisnika = {
            Lokacija: lokacija,
            Automobil: `${$('#TipVozila').val()}`,
            Musterija: localStorage.getItem("Ulogovan"),
        }

        $.ajax({
            type: 'POST',
            url: '/api/Registracija/Post',
            data: JSON.stringify(NovaVoznjaKorisnika),
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (!data) {
                    alert("Vožnja nije dodata!");
                } else {
                    alert("Uspešno ste dodali novu vožnju!");
                    $(location).attr('href', 'wellcome.html');
                }
            }
        })
    })

    /*$('#izmeniVoznjuKorisnik').click(function () {
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#divDodajVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divIzmeniVoznju').toggle(500);
    })*/



    /*$('#odustaniOdVoznjeKorisnik').click(function () {
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#divDodajVoznju').hide();
        $('#divIzmeniVoznju').hide();
        $('#divOtkaziVoznju').toggle(500);
    })*/

    // Kad se uloguje VOZAC

    $('#profilVozaca').click(function () {
        $('zaizmenuVozaca').hide();

        $('#PrikaziKreiraneVoznjeVozac').hide();
        $('#map1').hide();
        $('#UspjesnaVoznjaNoComm').hide();
        $('#KomentarNeuspjesnaVoznja').hide();
        $('#promenaLokacijeVozaca').hide();
        $('#PrikaziVoznjeVozac').hide();

        $('#1v').text(korisnik.KorisnickoIme);
        $('#2v').text(korisnik.Lozinka);
        $('#3v').text(korisnik.Ime);
        $('#4v').text(korisnik.Prezime);
        $('#5v').text(korisnik.JMBG);
        if (korisnik.Pol == 1) {
            $('#6v').text("Zenski");
        } else {
            $('#6v').text("Muski");
        }
        $('#7v').text(korisnik.Telefon);
        $('#8v').text(korisnik.Email);
        $('#9v').text(korisnik.Lokacija.X);
        $('#10v').text(korisnik.Lokacija.Y);
        $('#11v').text(korisnik.Lokacija.Adresa.UlicaBroj);
        $('#12v').text(korisnik.Lokacija.Adresa.NaseljenoMjesto);
        $('#13v').text(korisnik.Lokacija.Adresa.PozivniBroj);
        $('#14v').text(korisnik.Automobil.GodisteAutomobila);
        $('#15v').text(korisnik.Automobil.BrojRegistarskeOznake);
        $('#16v').text(korisnik.Automobil.BrojTaksiVozila);
        if (korisnik.Automobil.Tip == 0) {
            $('#17v').text("Kombi vozilo");
        }
        else {
            $('#17v').text("Putnicki automobil");
        }
        $('#zaprofilVozaca').toggle(500);
    })

    $('#IzmeniVozaca').click(function () {
        let niz = fulAdresa.split(",");

        let adresa = {
            UlicaBroj: `${niz[2]}`,
            NaseljenoMjesto: `${niz[3]}`,
            PozivniBroj: `${''}`
        }

        let lokacija = {
            X: `${niz[0]}`,
            Y: `${niz[1]}`,
            Adresa: adresa
        };


        let automobil = {
            Vozac: `${$('#KorisnickoImeV').val()}`,
            GodisteAutomobila: `${$('#GodisteAutomobilaV').val()}`,
            BrojRegistarskeOznake: `${$('#BrojRegistarskeOznakeV').val()}`,
            BrojTaksiVozila: `${$('#BrojTaksiVozilaV').val()}`,
            Tip: `${$('#TipV').val()}`,
        };

        let vozac = {
            KorisnickoIme: `${$('#KorisnickoImeV').val()}`,
            Lozinka: `${$('#LozinkaV').val()}`,
            Ime: `${$('#ImeV').val()}`,
            Prezime: `${$('#PrezimeV').val()}`,
            Pol: korisnik.Pol,
            JMBG: `${$('#JMBGV').val()}`,
            Telefon: `${$('#TelefonV').val()}`,
            Email: `${$('#EmailV').val()}`,
            Uloga: 'VOZAC',
            Voznja: "nema voznje",
            Lokacija: lokacija,
            Automobil: automobil
        };

        $.ajax({
            type: 'PUT',
            url: '/api/Vozac/' + korisnik.Id,
            data: JSON.stringify(vozac),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    localStorage.setItem("Ulogovan", vozac.KorisnickoIme);
                    alert('Data was succesfully captured');
                    $(location).attr('href', 'wellcome.html');
                }
                else {
                    alert('Error');
                }
            }
        })
    })

    $('#promenaLokacijeVozacaDugme').click(function () {
        let niz = fulAdresa.split(",");
        let adresa = {
            UlicaBroj: `${niz[2]}`,
            NaseljenoMjesto: `${niz[3]}`,
            PozivniBroj: `${''}`
        }

        let lokacija = {
            X: `${niz[0]}`,
            Y: `${niz[1]}`,
            Adresa: adresa
        };

        let vozac = {
            Id: korisnik.Id,
            Lokacija: lokacija
        };

        $.ajax({
            type: 'PUT',
            url: '/api/Vozac/',
            data: JSON.stringify(vozac),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    localStorage.setItem("Ulogovan", korisnik.KorisnickoIme);
                    alert('Data was succesfully captured');
                    $(location).attr('href', 'wellcome.html');
                }
                else {
                    alert('Error');
                }
            }
        })

    })

    $('#izmeniVozaca').click(function () {
        $('#zaprofilVozaca').hide();
        $('#map1').show();

        $('#PrikaziKreiraneVoznjeVozac').hide();
        $('#UspjesnaVoznjaNoComm').hide();
        $('#KomentarNeuspjesnaVoznja').hide();
        $('#promenaLokacijeVozaca').hide();
        $('#PrikaziVoznjeVozac').hide();

        $('#zaizmenuVozaca').toggle(500);
    })

    $('#odjaviVozaca').click(function () {
        localStorage.setItem("Ulogovan", null);
        $(location).attr('href', 'index.html');
    })

    // Prikaz svih kreiranih voznji

    $("#VozacKreirane").click(function () {
        //$("#PrikaziVoznjeVozac").hide();
        $('#PrikaziVoznjeVozac').hide();
        $("#PrikaziKreiraneVoznjeVozac").show();

        $('#zaprofilVozaca').hide();
        $('#zaizmenuVozaca').hide();
        $('#map1').hide();
        $('#UspjesnaVoznjaNoComm').hide();
        $('#KomentarNeuspjesnaVoznja').hide();
        $('#promenaLokacijeVozaca').hide();
        //$("#IzmjenaKorisnik2").hide();
        //$("#PrikazKorisnik2").hide();
        //$("#KomentarNeuspjesnaVoznja").hide();
        //$("#UspjesnaVoznjaNoComm").hide();
        $.get("/api/Voznja", function (data, status) {
            let tableOfProducts = "<table border='1'>";
            tableOfProducts += `<tr><th>Mušterija vožnje</th><th>Datum porudžbine</th><th>Ulica i br. dolaska</th><th>Mjesto dol.</th><th>Pozivni br. dol.</th><th>Status vož.</th><th>Opis kom.</th><th>Ocjena kom.</th><th>Dat. obj. kom. vož.</th><th> </th></tr>`;
            for (voznja in data) {
                if (data[voznja].Status == 0 && (data[voznja].Automobil == korisnik.Automobil.Tip) && (data[voznja].Vozac != korisnik.KorisnickoIme)) {
                    tableOfProducts += `<tr><td>${data[voznja].Musterija}</td><td>${data[voznja].VremePorudzbine}</td><td>${data[voznja].Lokacija.Adresa.UlicaBroj}</td><td>${data[voznja].Lokacija.Adresa.NaseljenoMjesto}</td><td>${data[voznja].Lokacija.Adresa.PozivniBroj}</td><td>Kreirana</td>`;
                    tableOfProducts += `<td>${data[voznja].Komentar.Opis}</td><td>${data[voznja].Komentar.OcenaVoznje}</td><td>${data[voznja].Komentar.DatumObjave}</td><td><button id="prihvatiVoznju" type="button" value=${data[voznja].IdVoznje}><b>Prihvati voznju</b></button></td></tr>`;
                }
            }
            tableOfProducts += "</table>";
            $("#PrikaziKreiraneVoznjeVozac").html(tableOfProducts);
        });
    });

    // Kraj

    // Prihvati voznju

    $(document).on('click', '#prihvatiVoznju', function () {
        let id6 = $(this).val();
        $("#PrikaziVoznjeVozac").hide();
        $("#IzmjenaKorisnik2").hide();
        $("#PrikazKorisnik2").hide();
        $("#PrikaziKreiraneVoznjeVozac").show();

        let voznja = {
            Vozac: korisnik.KorisnickoIme,
            Iznos: 0,
            Dispecer: null,
            Status: "PRIHVACENA",

        };
        $.ajax({
            type: 'PUT',
            url: '/api/Voznja/PutPrihvacena/' + id6,
            data: JSON.stringify(voznja),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    alert('Uspjesno prihvacena voznja');
                    $(location).attr('href', 'wellcome.html');
                } else {
                    alert('Ne postoji voznja koju zelite da prihvatite');
                }
            },
        })
    });

    // Kraj

    $(document).on('click', '#uspjesnaVoznja', function () {
        let fired_button9 = $(this).val();
        localStorage.setItem("uspjesnaVoznja", fired_button9);

        $('#PrikaziKreiraneVoznjeVozac').hide();
        $('#zaprofilVozaca').hide();
        $('#zaizmenuVozaca').hide();
        $('#map1').show();
        $('#UspjesnaVoznjaNoComm').show();
        $('#KomentarNeuspjesnaVoznja').hide();
        $('#promenaLokacijeVozaca').hide();
        $('#PrikaziVoznjeVozac').hide();

        $.get("/api/Voznja", function (data, status) {
            let id = localStorage.getItem("uspjesnaVoznja");
            let tableofData10 = "<table border='1'>";
            for (voznja in data) {
                if (data[voznja].IdVoznje == id) {
                    tableofData10 += //"<tr><td>Id lokacije odredista</td><td><input id=\"idlokodredista\" type=\"text\" name=\"IdLok\" value=\"" + data[voznja].Odrediste.IdLok + "\"/></td></tr>" +
                        "<tr><td>Iznos</td><td><input id=\"iznosodredista\" type=\"text\" name=\"Iznos\" value=\"" + data[voznja].Iznos + "\"/></td></tr>" +
                        "<tr><td colspan=\"2\" align=\"center\"><button id=\"potvrdiUnos\" type=\"button\"><b>Potvrdi unos odredista i iznosa</b></button></td></tr>";
                }
            }
            tableofData10 += "</table>";
            $("#IzmjenaShow10").html(tableofData10);
        });
    });

    $(document).on('click', '#potvrdiUnos', function () {
        let id10 = localStorage.getItem("uspjesnaVoznja");

        $('#PrikaziKreiraneVoznjeVozac').hide();
        $('#zaprofilVozaca').hide();
        $('#zaizmenuVozaca').hide();
        $('#map1').show();
        $('#UspjesnaVoznjaNoComm').show();
        $('#KomentarNeuspjesnaVoznja').hide();
        $('#promenaLokacijeVozaca').hide();
        $('#PrikaziVoznjeVozac').hide();

        let niz = fulAdresa.split(",");


        let adresaOdrediste = {
            //IdAdr: `${$('#idadrodredista').val()}`,
            UlicaBroj: `${niz[2]}`,
            NaseljenoMjesto: `${niz[3]}`,
            PozivniBroj: `${''}`,
        };
        let lokacijaOdrediste = {
            //IdLok: `${$('#idlokodredista').val()}`,
            X: `${niz[0]}`,
            Y: `${niz[1]}`,
            Adresa: adresaOdrediste,
        };
        let voznja10 = {
            Vozac: korisnik.KorisnickoIme,
            Odrediste: lokacijaOdrediste,
            Iznos: `${$('#iznosodredista').val()}`,
            Status: "USPESNA",
        };
        $.ajax({
            type: 'PUT',
            url: '/api/Voznja/PutVozacUspesno/' + id10,
            data: JSON.stringify(voznja10),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    alert('Uspjesna voznja');
                    $(location).attr('href', 'wellcome.html');
                } else {
                    alert('Ne postoji voznja koju zelite proglasiti uspjesnom.');
                }
            },
        })
    });

    $(document).on('click', '#neuspjesnaVoznjaKomentar', function () {
        let fired_button7 = $(this).val();
        localStorage.setItem("neuspjesnaVoznja", fired_button7);
        $('#PrikaziKreiraneVoznjeVozac').hide();
        $('#zaprofilVozaca').hide();
        $('#zaizmenuVozaca').hide();
        $('#map1').hide();
        $('#UspjesnaVoznjaNoComm').hide();
        $('#KomentarNeuspjesnaVoznja').show();
        $('#promenaLokacijeVozaca').hide();
        $('#PrikaziVoznjeVozac').hide();
        $.get("/api/Voznja", function (data, status) {
            let id = localStorage.getItem("neuspjesnaVoznja");
            let tableofData7 = "<table border='1'>";
            for (voznja in data) {
                if (data[voznja].IdVoznje == id) {
                    tableofData7 += "<tr><td>Opis</td><td><input id=\"opis1\" type=\"text\" name=\"Opis\" value=\"" + data[voznja].Komentar.Opis + "\"/></td></tr>" +
                        "<tr><td>Datum objave</td><td><input id=\"datum1\" type=\"datetime\" name=\"DTObjave\" value=\"" + data[voznja].Komentar.DatumObjave + "\"/></td></tr>" +
                        "<tr><td>Ocjena</td><td><input id=\"ocjena1\" min=\"0\" max=\"5\" type=\"number\" name=\"Ocjena\" value=\"" + data[voznja].Komentar.OcenaVoznje + "\"/></td></tr>" +
                        "<tr><td colspan=\"2\" align=\"center\"><button id=\"neuspjesnaVoznjaPotvrdi\" type=\"button\"><b>Potvrdi komentar</b></button></td></tr>";
                }
            }
            tableofData7 += "</table>";
            $("#IzmjenaShow7").html(tableofData7);
        });
    });

    $(document).on('click', '#neuspjesnaVoznjaPotvrdi', function () {
        let id8 = localStorage.getItem("neuspjesnaVoznja");

        let komentarVoznja1 = {
            Opis: `${$('#opis1').val()}`,
            DatumObjave: `${$('#datum1').val()}`,
            OcenaVoznje: `${$('#ocjena1').val()}`,
            KorisnickoIme: korisnik.KorisnickoIme,
            IdVoznje: id8,
        };
        let voznja1 = {
            Vozac: korisnik.KorisnickoIme,
            Iznos: 0,
            Komentar: komentarVoznja1,
            Status: "NEUSPESNA",
        };
        $.ajax({
            type: 'PUT',
            url: '/api/Voznja/PutVozacNeuspesno/' + id8,
            data: JSON.stringify(voznja1),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    alert('Neuspjesna voznja');
                    $(location).attr('href', 'wellcome.html');
                } else {
                    alert('Ne postoji voznja koju zelite proglasiti neuspjesnom.');
                }
            },
        })
    })

    $('#PromenaLok').click(function () {
        $('#PrikaziKreiraneVoznjeVozac').hide();
        $('#zaprofilVozaca').hide();
        $('#zaizmenuVozaca').hide();
        $('#map1').show();
        $('#UspjesnaVoznjaNoComm').hide();
        $('#KomentarNeuspjesnaVoznja').hide();
        $('#promenaLokacijeVozaca').show();
        $('#PrikaziVoznjeVozac').hide();
    })

    $('#PrikazM').click(function () {
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#map1').hide();
        $('#divDodajVoznju').hide();
        $('#divIzmeniVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divKomentarisiVoznju').hide();
        $('#PretraziKorisnikdiv').hide();
        $('#SortirajKorisnikdiv').hide();
        $('#PrikazKorisnik').show();
    })

    $('#PrikazD').click(function () {
        $('#zaprofilDispecer').hide();
        $('#zaizmenuDispecer').hide();
        $('#PrikazDispecerSve').hide();
        $('#zadodajVozaca').hide();
        $('#zadodajVoznju').hide();
        $('#map1').hide();

        $('#PrikazDispecer').show();
    })

    $('#PrikazV').click(function () {
        $('#PrikaziKreiraneVoznjeVozac').hide();
        $('#zaprofilVozaca').hide();
        $('#zaizmenuVozaca').hide();
        $('#map1').hide();
        $('#UspjesnaVoznjaNoComm').hide();
        $('#KomentarNeuspjesnaVoznja').hide();
        $('#promenaLokacijeVozaca').hide();
        $('#PrikaziVoznjeVozac').show();
    })

    $('#PretraziKorisnik').click(function () {
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#map1').hide();
        $('#divDodajVoznju').hide();
        $('#divIzmeniVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divKomentarisiVoznju').hide();
        $('#PrikazKorisnik').hide();
        $('#PretraziKorisnikdiv').show();

        let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><br /><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

        table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p>";

        table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

        table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

        table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";
        kopija = [];
        pretraga = false;
        $('#PretraziKorisnikdiv').html(table);
    })

    let pretraga = false;
    let kopija = [];

    $(document).on('click', '#pretragaKorisnikRefreshButton', function () {
        $('#zaprofil').hide();
        $('#zaizmenu').hide();
        $('#map1').hide();
        $('#divDodajVoznju').hide();
        $('#divIzmeniVoznju').hide();
        $('#divOtkaziVoznju').hide();
        $('#divKomentarisiVoznju').hide();
        $('#PrikazKorisnik').hide();
        $('#PretraziKorisnikdiv').show();

        let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><br /><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

        table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p>";

        table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

        table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

        table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";
        pretraga = false;
        kopija = [];
        $('#PretraziKorisnikdiv').html(table);
    })

    $(document).on('click', '#filtrirajKorisnikButton', function () {

        let vs = [];

        $.ajax({
            type: 'GET',
            url: '/api/Voznja',
            async: false,
            success: function (data) {
                if (pretraga) {
                    data = kopija;
                } else {
                    kopija = [];
                }

                let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><br /><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

                table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p>";

                table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

                table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

                table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";

                table += "<table border=\"1\">";
                let stanje = `${$('#filtriranjeSelectKorisnik').val()}`;

                table += "<tr><th>ID voznje</th><th>Datum</th><th>Mesto polaska</th><th>Tip automobila</th><th>Odrediste</th><th>Iznos</th><th>Komentar</th><th>Status voznje</th><th>Opcije</th></tr>"
                for (voznja in data) {
                    if (korisnik.KorisnickoIme == data[voznja].Musterija && data[voznja].Status == stanje) {
                        vs.push(data[voznja]);
                        table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                        switch (data[voznja].Automobil) {
                            case 0:
                                table += "Putnicki automobil";
                                break;
                            case 1:
                                table += "Kombi vozilo";
                                break;
                        }
                        table += "</td>";

                        if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                            table += ("<td>/</td>");
                        }
                        else {
                            table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                        }

                        if (data[voznja].Iznos != "0") {
                            table += ("<td>" + data[voznja].Iznos + "</td>");
                        }
                        else {
                            table += ("<td>/</td>");
                        }

                        table += ('<td><textarea rows="5" cols="30" disabled>');

                        if (data[voznja].Komentar.Opis == "") {
                            table += ("Komentar nije dodat!" + "</textarea></td>");
                        } else {
                            table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                        }

                        if (data[voznja].Status == 0) {
                            table += '<td>Kreirana</td>';
                        } else if (data[voznja].Status == 1) {
                            table += '<td>Formirana</td>';
                        } else if (data[voznja].Status == 2) {
                            table += '<td>Obradjena</td>';
                        } else if (data[voznja].Status == 3) {
                            table += '<td>Prihvacena</td>';
                        } else if (data[voznja].Status == 4) {
                            table += '<td>Otkazana</td>';
                        } else if (data[voznja].Status == 5) {
                            table += '<td>Neuspjesna</td>';
                        } else if (data[voznja].Status == 6) {
                            table += '<td>Uspjesna</td>';
                        }
                        table += "<td>";
                        if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                            table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                            table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                        } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                            table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                        } else {
                            table += ("Nedostupne");
                        }
                        table += "</td></tr>";
                    }
                }
                table += "</table>";
                kopija = vs;
                pretraga = true;
                $('#PretraziKorisnikdiv').html(table);
            }
        })
    })

    $(document).on('click', '#sortirajOcjenaKorisnikButton', function () {

        let vs = [];

        $.ajax({
            type: 'GET',
            url: '/api/Voznja',
            async: false,
            success: function (data) {
                if (pretraga) {
                    data = kopija;
                } else {
                    //kopija = [];
                }

                let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

                table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p><hr />";

                table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

                table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

                table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";

                table += "<table border=\"1\">";
                table += "<tr><th>ID voznje</th><th>Datum</th><th>Mesto polaska</th><th>Tip automobila</th><th>Odrediste</th><th>Iznos</th><th>Komentar</th><th>Status voznje</th><th>Opcije</th></tr>"

                data.sort(function (a, b) {
                    return b.Komentar.OcenaVoznje - a.Komentar.OcenaVoznje;
                })

                for (voznja in data) {
                    if (korisnik.KorisnickoIme == data[voznja].Musterija) {
                        vs.push(data[voznja]);
                        table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                        switch (data[voznja].Automobil) {
                            case 0:
                                table += "Putnicki automobil";
                                break;
                            case 1:
                                table += "Kombi vozilo";
                                break;
                        }
                        table += "</td>";

                        if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                            table += ("<td>/</td>");
                        }
                        else {
                            table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                        }

                        if (data[voznja].Iznos != "0") {
                            table += ("<td>" + data[voznja].Iznos + "</td>");
                        }
                        else {
                            table += ("<td>/</td>");
                        }

                        table += ('<td><textarea rows="5" cols="30" disabled>');

                        if (data[voznja].Komentar.Opis == "") {
                            table += ("Komentar nije dodat!" + "</textarea></td>");
                        } else {
                            table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                        }

                        if (data[voznja].Status == 0) {
                            table += '<td>Kreirana</td>';
                        } else if (data[voznja].Status == 1) {
                            table += '<td>Formirana</td>';
                        } else if (data[voznja].Status == 2) {
                            table += '<td>Obradjena</td>';
                        } else if (data[voznja].Status == 3) {
                            table += '<td>Prihvacena</td>';
                        } else if (data[voznja].Status == 4) {
                            table += '<td>Otkazana</td>';
                        } else if (data[voznja].Status == 5) {
                            table += '<td>Neuspjesna</td>';
                        } else if (data[voznja].Status == 6) {
                            table += '<td>Uspjesna</td>';
                        }
                        table += "<td>";
                        if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                            table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                            table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                        } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                            table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                        } else {
                            table += ("Nedostupne");
                        }
                        table += "</td></tr>";
                    }
                }
                table += "</table>";
                kopija = vs;
                pretraga = true;
                $('#PretraziKorisnikdiv').html(table);
            }
        })

    })

    $(document).on('click', '#sortirajDatumKorisnikButton', function () {

        let vs = [];

        $.ajax({
            type: 'GET',
            url: '/api/Voznja',
            async: false,
            success: function (data) {
                if (pretraga) {
                    data = kopija;
                } else {
                    //kopija = [];
                }

                let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

                table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p><hr />";

                table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

                table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

                table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";

                table += "<table border=\"1\">";
                table += "<tr><th>ID voznje</th><th>Datum</th><th>Mesto polaska</th><th>Tip automobila</th><th>Odrediste</th><th>Iznos</th><th>Komentar</th><th>Status voznje</th><th>Opcije</th></tr>"

                data.sort(function (a, b) {
                    return new Date(b.Komentar.DatumObjave) - new Date(a.Komentar.DatumObjave);
                })

                for (voznja in data) {
                    if (korisnik.KorisnickoIme == data[voznja].Musterija) {
                        vs.push(data[voznja]);
                        table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                        switch (data[voznja].Automobil) {
                            case 0:
                                table += "Putnicki automobil";
                                break;
                            case 1:
                                table += "Kombi vozilo";
                                break;
                        }
                        table += "</td>";

                        if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                            table += ("<td>/</td>");
                        }
                        else {
                            table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                        }

                        if (data[voznja].Iznos != "0") {
                            table += ("<td>" + data[voznja].Iznos + "</td>");
                        }
                        else {
                            table += ("<td>/</td>");
                        }

                        table += ('<td><textarea rows="5" cols="30" disabled>');

                        if (data[voznja].Komentar.Opis == "") {
                            table += ("Komentar nije dodat!" + "</textarea></td>");
                        } else {
                            table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                        }

                        if (data[voznja].Status == 0) {
                            table += '<td>Kreirana</td>';
                        } else if (data[voznja].Status == 1) {
                            table += '<td>Formirana</td>';
                        } else if (data[voznja].Status == 2) {
                            table += '<td>Obradjena</td>';
                        } else if (data[voznja].Status == 3) {
                            table += '<td>Prihvacena</td>';
                        } else if (data[voznja].Status == 4) {
                            table += '<td>Otkazana</td>';
                        } else if (data[voznja].Status == 5) {
                            table += '<td>Neuspjesna</td>';
                        } else if (data[voznja].Status == 6) {
                            table += '<td>Uspjesna</td>';
                        }
                        table += "<td>";
                        if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                            table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                            table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                        } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                            table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                        } else {
                            table += ("Nedostupne");
                        }
                        table += "</td></tr>";
                    }
                }
                table += "</table>";
                kopija = vs;
                pretraga = true;
                $('#PretraziKorisnikdiv').html(table);
            }
        })
    })


    $(document).on('click', '#pretragaKorisnikOcjenaButton', function () {
        let vs = [];

        $.ajax({
            type: 'GET',
            url: '/api/Voznja',
            async: false,
            success: function (data) {
                if (pretraga) {
                    data = kopija;
                } else {
                    //kopija = [];
                }

                let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

                table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p><hr />";

                table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

                table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

                table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";

                let OcjenaOd = `${$('#pretragaOdOcjenaKorisnik').val()}`;
                let OcjenaDo = `${$('#pretragaDoOcjenaKorisnik').val()}`;

                if (OcjenaOd == 0 && OcjenaDo == 0) {
                    alert("Unesite pravilno polja za pretragu!");
                }
                else {
                    table += "<table border=\"1\">";
                    table += "<tr><th>ID voznje</th><th>Datum</th><th>Mesto polaska</th><th>Tip automobila</th><th>Odrediste</th><th>Iznos</th><th>Komentar</th><th>Status voznje</th><th>Opcije</th></tr>"
                    if (OcjenaDo == 0 && OcjenaOd != 0) {
                        for (voznja in data) {
                            if (data[voznja].Komentar.OcenaVoznje >= OcjenaOd && data[voznja].Musterija == korisnik.KorisnickoIme && (data[voznja].Status == 4 || data[voznja].Status == 5 || data[voznja].Status == 6)) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    }
                    else if (OcjenaOd != 0 && OcjenaDo != 0) {
                        for (voznja in data) {
                            if (data[voznja].Komentar.OcenaVoznje >= OcjenaOd && data[voznja].Komentar.OcenaVoznje <= OcjenaDo && data[voznja].Musterija == korisnik.KorisnickoIme && (data[voznja].Status == 4 || data[voznja].Status == 5 || data[voznja].Status == 6)) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    } else {
                        for (voznja in data) {
                            if (data[voznja].Komentar.OcenaVoznje <= OcjenaDo && data[voznja].Musterija == korisnik.KorisnickoIme && (data[voznja].Status == 4 || data[voznja].Status == 5 || data[voznja].Status == 6)) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    }
                    table += "</table>";
                    kopija = vs;
                    pretraga = true;
                    $('#PretraziKorisnikdiv').html(table);
                }
            }
        })
    })


    $(document).on('click', '#pretragaKorisnikCijenaButton', function () {
        let vs = [];

        $.ajax({
            type: 'GET',
            url: '/api/Voznja',
            async: false,
            success: function (data) {
                if (pretraga) {
                    data = kopija;
                } else {
                    //kopija = [];
                }

                let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

                table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p><hr />";

                table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

                table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

                table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";

                let CijenaOd = `${$('#pretragaOdCijenaKorisnik').val()}`;
                let CijenaDo = `${$('#pretragaDoCijenaKorisnik').val()}`;

                if (CijenaOd == "" && CijenaDo == "") {
                    alert("Pravilno unesite vrednosti");
                }
                else {
                    table += "<table border=\"1\">";
                    table += "<tr><th>ID voznje</th><th>Datum</th><th>Mesto polaska</th><th>Tip automobila</th><th>Odrediste</th><th>Iznos</th><th>Komentar</th><th>Status voznje</th><th>Opcije</th></tr>"
                    if (CijenaDo == "" && CijenaOd != "") {
                        for (voznja in data) {
                            if (data[voznja].Iznos >= CijenaOd && data[voznja].Status == 6 && data[voznja].Musterija == korisnik.KorisnickoIme) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    }
                    else if (CijenaOd != "" && CijenaDo != "") {
                        for (voznja in data) {
                            if (data[voznja].Iznos >= CijenaOd && data[voznja].Iznos <= CijenaDo && data[voznja].Status == 6 && data[voznja].Musterija == korisnik.KorisnickoIme) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    } else {
                        for (voznja in data) {
                            if (data[voznja].Iznos <= CijenaDo && data[voznja].Status == 6 && data[voznja].Musterija == korisnik.KorisnickoIme) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    }
                    table += "</table>";
                    kopija = vs;
                    pretraga = true;
                    $('#PretraziKorisnikdiv').html(table);
                }
            }
        })
    })

    $(document).on('click', '#pretragaKorisnikDatumButton', function () {
        let vs = [];

        $.ajax({
            type: 'GET',
            url: '/api/Voznja',
            async: false,
            success: function (data) {
                if (pretraga) {
                    data = kopija;
                } else {
                    //kopija = [];
                }

                let table = "<p>Filtriranje na osnovu statusa voznje:&nbsp; &nbsp; <select id=\"filtriranjeSelectKorisnik\" name=\"TipFiltriranje\"><option value=0>Kreirana</option><option value=1>Formirana</option><option value=2>Obradjena</option><option value=3>Prihvacena</option><option value=4>Otkazana</option><option value=5>Neuspesna</option><option value=6>Uspesna</option></select>&nbsp;&nbsp;<button id=\"filtrirajKorisnikButton\">Filtriraj</button></p><br /><p>Sortiranje po oceni: <button id=\"sortirajOcjenaKorisnikButton\">Sortiraj</button></p><p>Sortiranje po datumu: <button id=\"sortirajDatumKorisnikButton\">Sortiraj</button></p>";

                table += "<p>Pretraga po oceni (od, do, od-do) -> od: <select id=\"pretragaOdOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> do: <select id=\"pretragaDoOcjenaKorisnik\"><option id=0></option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select> <button id=\"pretragaKorisnikOcjenaButton\">Pretrazi</button></p><hr />";

                table += "<p>Pretraga po ceni (od, do, od-do) -> od: <input type=\"number\" id=\"pretragaOdCijenaKorisnik\"/> do: <input type=\"number\" step=\"any\" id=\"pretragaDoCijenaKorisnik\"/> <button id=\"pretragaKorisnikCijenaButton\">Pretrazi</button></p>";

                table += "<p>Pretraga po datumu (od, do, od-do) -> od: <input type=\"date\" id=\"pretragaOdDatumKorisnik\"/> do: <input type=\"date\" id=\"pretragaDoDatumKorisnik\"/> <button id=\"pretragaKorisnikDatumButton\">Pretrazi</button></p>";

                table += "<button id=\"pretragaKorisnikRefreshButton\">Osvezi</button><hr /> ";

                let DatumOd = `${$('#pretragaOdDatumKorisnik').val()}`;
                let DatumDo = `${$('#pretragaDoDatumKorisnik').val()}`;

                if (DatumDo == "" && DatumOd == "") {
                    alert("Pravilno unesite vrednosti");
                } else {
                    table += "<table border=\"1\">";
                    table += "<tr><th>ID voznje</th><th>Datum</th><th>Mesto polaska</th><th>Tip automobila</th><th>Odrediste</th><th>Iznos</th><th>Komentar</th><th>Status voznje</th><th>Opcije</th></tr>"
                    if (DatumDo == "" && DatumOd != "") {
                        for (voznja in data) {
                            let date = data[voznja].VremePorudzbine.split('T');
                            if (new Date(date[0]) >= new Date(DatumOd) && data[voznja].Musterija == korisnik.KorisnickoIme) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    }
                    else if (DatumOd != "" && DatumDo != "") {
                        for (voznja in data) {
                            let date = data[voznja].VremePorudzbine.split('T');
                            if (new Date(date[0]) >= new Date(DatumOd) && new Date(date[0]) <= new Date(DatumDo) && data[voznja].Musterija == korisnik.KorisnickoIme) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    } else {
                        for (voznja in data) {
                            let date = data[voznja].VremePorudzbine.split('T');
                            if (new Date(date[0]) <= new Date(DatumDo) && data[voznja].Musterija == korisnik.KorisnickoIme) {
                                vs.push(data[voznja]);
                                table += ("<tr><td>" + data[voznja].IdVoznje + "</td><td>" + data[voznja].VremePorudzbine + "</td><td>" + data[voznja].Lokacija.Adresa.UlicaBroj + ", " + data[voznja].Lokacija.Adresa.NaseljenoMjesto + ", " + data[voznja].Lokacija.Adresa.PozivniBroj + "</td><td>");
                                switch (data[voznja].Automobil) {
                                    case 0:
                                        table += "Putnicki automobil";
                                        break;
                                    case 1:
                                        table += "Kombi vozilo";
                                        break;
                                }
                                table += "</td>";

                                if (data[voznja].Odrediste.Adresa.UlicaBroj == "") {
                                    table += ("<td>/</td>");
                                }
                                else {
                                    table += ("</td><td>" + data[voznja].Odrediste.Adresa.UlicaBroj + ", " + data[voznja].Odrediste.Adresa.NaseljenoMjesto + " " + data[voznja].Odrediste.Adresa.PozivniBroj + "</td>");
                                }

                                if (data[voznja].Iznos != "0") {
                                    table += ("<td>" + data[voznja].Iznos + "</td>");
                                }
                                else {
                                    table += ("<td>/</td>");
                                }

                                table += ('<td><textarea rows="5" cols="30" disabled>');

                                if (data[voznja].Komentar.Opis == "") {
                                    table += ("Komentar nije dodat!" + "</textarea></td>");
                                } else {
                                    table += ("Korisnicko ime: " + data[voznja].Komentar.KorisnickoIme + "\n\nOpis: " + data[voznja].Komentar.Opis + "\n\nOcena: " + data[voznja].Komentar.OcenaVoznje + "\nDatum: " + data[voznja].Komentar.DatumObjave + "</textarea ></td >");
                                }

                                if (data[voznja].Status == 0) {
                                    table += '<td>Kreirana</td>';
                                } else if (data[voznja].Status == 1) {
                                    table += '<td>Formirana</td>';
                                } else if (data[voznja].Status == 2) {
                                    table += '<td>Obradjena</td>';
                                } else if (data[voznja].Status == 3) {
                                    table += '<td>Prihvacena</td>';
                                } else if (data[voznja].Status == 4) {
                                    table += '<td>Otkazana</td>';
                                } else if (data[voznja].Status == 5) {
                                    table += '<td>Neuspjesna</td>';
                                } else if (data[voznja].Status == 6) {
                                    table += '<td>Uspjesna</td>';
                                }
                                table += "<td>";
                                if (vratiStatusVoznje(data[voznja].Status) == "Kreirana") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="odustani">Odustani</button><br /><br />`);
                                    table += (`<button value=${data[voznja].IdVoznje} id="izmeniV">Izmeni</button>`);
                                } else if (vratiStatusVoznje(data[voznja].Status) == "Uspešna") {
                                    table += (`<button value=${data[voznja].IdVoznje} id="UspesanKomentar">Komentar</button>`);
                                } else {
                                    table += ("Nedostupne");
                                }
                                table += "</td></tr>";
                            }
                        }
                    }
                    table += "</table>";
                    kopija = vs;
                    pretraga = true;
                    $('#PretraziKorisnikdiv').html(table);
                }
            }
        })
    })
});