$(document).ready(function () {
    $('#login-form-link').click(function (e) {
        $("#login-form").delay(100).fadeIn(100);
        $("#register-form").fadeOut(100);
        $('#register-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });
    $('#register-form-link').click(function (e) {
        $("#register-form").delay(100).fadeIn(100);
        $("#login-form").fadeOut(100);
        $('#login-form-link').removeClass('active');
        $(this).addClass('active');
        e.preventDefault();
    });

    $("#prijava").click(function () {
        let korisnik = {
            KorisnickoIme: `${$('#korIme').val()}`,
            Lozinka: `${$('#korPass').val()}`,
        };

        $.ajax({
            type: 'POST',
            url: '/api/Log',
            data: JSON.stringify(korisnik),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    localStorage.setItem("Ulogovan", korisnik.KorisnickoIme);
                    $(location).attr('href', 'wellcome.html');
                    //$.get
                }
                else {
                    alert('Error');
                }
            }
        })
    });

    $("#registracija").click(function () {
        let korisnik = {
            KorisnickoIme: `${$('#korImeReg').val()}`,
            Lozinka: `${$('#korPassReg').val()}`,
            Ime: `${$('#ime').val()}`,
            Prezime: `${$('#prezime').val()}`,
            Pol: `${$('#pol').val()}`,
            JMBG: `${$('#jmbg').val()}`,
            Telefon: `${$('#brTelefona').val()}`,
            Email: `${$('#emailAdr').val()}`,
            Uloga: 'MUSTERIJA',
            Voznja: `${$('#voznja').val()}`,
        };

        $.ajax({
            type: 'POST',
            url: '/api/Registracija',
            data: JSON.stringify(korisnik),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    alert('Data was succesfully captured');
                    $(location).attr('href', 'index.html');
                }
                else {
                    alert('Error');
                }
            }
        })
    });
});