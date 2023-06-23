$( document ).ready(function() {
    mytoken = document.cookie
    mytoken = mytoken.substring(6)
    $.ajax({
        type: 'GET',
        method: 'GET',
        url: "/user_profile_info_api",
        headers: {
            "token":mytoken
        },
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        if (response.status == "error" || response.status == undefined ) {
            document.getElementById("infos").innerHTML = "une erreur est survenue lors de la récupération de vos données"
        } else if (response.status == "success" && response.data != undefined) {
        html = `
        <ul>
            <li>
                <label for="name">Prénom :</label>
                <span id="name">${response.data.name}</span>
            </li>
            <li>
                <label for="first-name">Nom :</label>
                <span id="first-name">${response.data.lastName}</span>
            </li>
            <li>
                <label for="email">Email :</label>
                <span id="email">${response.data.email}</span>
            </li>
            <li>
                <label for="phone_number">Numéro de téléphone :</label>
                <span id="phone_number">${response.data.phonenumber}</span>
            </li>
            <li>
                <label for="adress">adresse :</label>
                <span id="adress">${response.data.adress}</span>
            </li>
        </ul>
        `
        document.getElementById("infos").innerHTML = html
        } else {
            document.getElementById("infos").innerHTML = "une erreur est survenue lors de la récupération de vos données"
        }
    })
});
