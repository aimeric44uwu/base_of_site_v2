$(document).ready(async function () {
    document.body.style.marginTop = "100px";
    var navbar_html_file;
    if (window.location.href.replace(/[^//]/g, "").length == 3) {
        navbar_html_file = await fetch("./template/navbar.html");
    } else if(window.location.href.replace(/[^//]/g, "").length == 4) {
        navbar_html_file = await fetch("../../template/navbar.html");
    } else  if(window.location.href.replace(/[^//]/g, "").length == 5) {
        navbar_html_file = await fetch("../../../template/navbar.html");
    } else  if(window.location.href.replace(/[^//]/g, "").length == 6) {
        navbar_html_file = await fetch("../../../../template/navbar.html");
    } else {
        navbar_html_file = await fetch("../template/navbar.html");
    }

    document.body.innerHTML += `
    <div id="navbar_emplacement"></div>`
    const navbar_html = await navbar_html_file.text();
    document.getElementById("navbar_emplacement").innerHTML = navbar_html;
    mytoken = document.cookie
    mytoken = mytoken.substring(6)
    $.ajax({
        type: 'GET',
        method: 'GET',
        url: "/navbar_info_api",
        headers: {
            "token": mytoken,
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        html = ``
        if (response.status == "notloggedin") {
            html += `
          <li style="margin-left: -450px"><button onclick="switch_to_login()">Login</button></li>
          <li><button onclick="switch_to_register()">Register</button></li>
          `
        } else if (response.data.username != undefined && response.status == "loggedin") {
            document.getElementById("navbar").style.marginBottom = "10px";
            var first_dropdown = "";
            if (window.location.pathname == "/")
                first_dropdown = `<a href="/profile">Mon compte</a>`
            else
                first_dropdown = `<a href="/">Menu</a>`
            document.getElementById("navbar").style.marginTop = "30px";
            html += `
          <li style="margin-left: -525px;margin-right: 25px">Bonjour <b>${response.data.username}</b></li>
          <li class="dropdown">
            <a>Menu</a>
            <div class="dropdown-menu">
                ${first_dropdown}
                <a href="/upuser">modify account</a>
                <a href="/deluser">delete an account</a>
            </div>
            <div class="container_icon">
                <div class="drop_down_menu_icon"></div>
                <div class="drop_down_menu_icon"></div>
                <div class="drop_down_menu_icon"></div>
            </div>
          </li>
          <li style="margin-left: 50px;"><button onclick="location.href='/logout'" style="margin: 0px">Logout</button></li>
        `
        } else {
            html += `
            <li style="margin-left: -450px"><button onclick="location.href='/login'">Login</button></li>
            <li><button onclick="location.href='/register'">Register</button></li>
            `
        }
        if (document.cookie.includes("darkmode=true")) {
            html += `<li style="left: 175px; position: fixed"><button onclick="switch_to_light_mode()">passez en mode clair</button></li>`
        } else {
            html += `<li style="left: 175px; position: fixed"><button onclick="switch_to_dark_mode()">passez en mode sombre</button></li>`
        }
        document.getElementById("navbar").innerHTML = html
    })
});

function switch_to_dark_mode() {
    document.cookie = "darkmode=true;path=/;"
    location.reload()
}

function switch_to_light_mode() {
    document.cookie = "darkmode=false;path=/;"
    location.reload()
}