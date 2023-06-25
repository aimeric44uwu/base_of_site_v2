function delacc() {
    let id = document.getElementById("userid").value;
    mytoken = document.cookie
    mytoken = mytoken.substring(6)
    $.ajax({
        type: 'DELETE',
        method: 'DELETE',
        url: "/users/" + id,
        headers: {
            "token":mytoken,
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        if(response.token != undefined){
            document.cookie = 'token=' + response.token+'; path=/;';
        }
        if (response.responseJSON != undefined) {
            document.getElementById("check").style.color = "red";
            document.getElementById("check").innerHTML = response.responseJSON.msg;
        } else {
            document.getElementById("check").innerHTML = "successfully deleted";
            document.getElementById("check").style.color = "green";
            setTimeout (() => {
                document.getElementById("aa").click();
            }, 3000);
        }
        setTimeout(() => {
            document.getElementById("check").innerHTML = "";
            document.getElementById("check").style.color = "";
        }, 6000);
    })
}

function switch_to_login() {
    document.getElementById("login_page").style.display = "block";
    document.getElementById("register_page").style.display = "none";
}

function switch_to_register() {
    document.getElementById("login_page").style.display = "none";
    document.getElementById("register_page").style.display = "block";
}

function modifaccount() {
    let jsondata = `
    {
    "email": "${document.getElementById("register_email").value}",
    "username": "${document.getElementById("register_username").value}",
    "password": "${document.getElementById("register_password").value}",
    }`;
//    "adress": "${document.getElementById("register_adress").value}",
//    "phonenumber": "${document.getElementById("register_phonenumber").value}",
//    "firstname": "${document.getElementById("register_name").value}",
//    "lastname": "${document.getElementById("register_lastname").value}"
    let id = document.getElementById("userid").value;
    mytoken = document.cookie
    mytoken = mytoken.substring(6)
    $.ajax({
        type: 'PUT',
        method: 'PUT',
        url: "/users/" + id,
        data: jsondata,
        headers: {
            "token":mytoken,
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        if (response.responseJSON != undefined) {
            document.getElementById("check").style.color = "red";
            document.getElementById("check").innerHTML = response.responseJSON.message;
        } else {
            document.getElementById("check").style.color = "green";
            document.getElementById("check").innerHTML = response.message;
            setTimeout (() => {
                document.getElementById("aa").click();
            }, 3000);
        }
        setTimeout(() => {
            document.getElementById("check").innerHTML = "";
            document.getElementById("check").style.color = "";
        }, 6000);
    })
}

function login()
{
    if (document.getElementById("login_email").value == "" || document.getElementById("login_password").value == "") {
        document.getElementById("login_check").style.color = "red";
        document.getElementById("login_check").innerHTML = "veuillez remplir tous les champs";
        setTimeout(() => {
            document.getElementById("login_check").innerHTML = "";
            document.getElementById("login_check").style.color = "";
        }, 6000);
        return;
    }
    let jsondata = `
    {
        "email": "${document.getElementById("login_email").value}",
        "password": "${document.getElementById("login_password").value}"
    }`;
    $.ajax({
        type: 'POST',
        method: 'POST',
        url: "/login",
        data: jsondata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 20000,
    }).always((response) => {
        if (response.responseJSON != undefined) {
            document.getElementById("login_check").style.color = "red";
            document.getElementById("login_check").innerHTML = response.responseJSON.message;
        } else {
                document.getElementById("login_check").style.color = "green";
                document.getElementById("login_check").innerHTML = response.message;
                setTimeout (() => {
                    document.getElementById("login_redirect").click();
                }, 3000);
        }
        setTimeout(() => {
            document.getElementById("login_check").innerHTML = "";
            document.getElementById("login_check").style.color = "";
        }, 6000);
    })
}

function register()
{
    /*
     document.getElementById("register_firstName").value == "" ||
    document.getElementById("register_lastName").value == "" || 
    document.getElementById("register_adress").value == "" || 
    document.getElementById("register_phonenumber").value == ""
    */
    if (document.getElementById("register_email").value == "" || document.getElementById("register_password").value == ""
    || document.getElementById("register_username").value == "") {
        document.getElementById("register_check").style.color = "red";
        document.getElementById("register_check").innerHTML = "veuillez remplir tous les champs";
        setTimeout(() => {
            document.getElementById("register_check").innerHTML = "";
            document.getElementById("register_check").style.color = "";
        }, 6000);
        return;
    }
    let jsondata = `
    {
        "email": "${document.getElementById("register_email").value}",
        "username": "${document.getElementById("register_username").value}",
        "password": "${document.getElementById("register_password").value}"
    }`;
//    "firstName": "${document.getElementById("register_firstName").value}",
//    "lastName": "${document.getElementById("register_lastName").value}",
//    "adress": "${document.getElementById("register_adress").value}",
//    "phonenumber": "${document.getElementById("register_phonenumber").value}"
    $.ajax({
        type: 'POST',
        method: 'POST',
        url: "/register",
        data: jsondata,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 20000,
    }).always((response) => {
        if (response.responseJSON != undefined) {
            if (response.responseJSON.status == "error" || response.responseJSON.status == "Internalerror") {
                document.getElementById("register_check").style.color = "red";
                document.getElementById("register_check").innerHTML = response.responseJSON.message;
            }
        } else {
            document.getElementById("register_check").style.color = "green";
            document.getElementById("register_check").innerHTML = response.message;
            setTimeout (() => {
                document.getElementById("register_redirect").click();
            }, 3000);
        }
        setTimeout(() => {
            document.getElementById("register_check").innerHTML = "";
            document.getElementById("register_check").style.color = "";
        }, 6000);
    })
}