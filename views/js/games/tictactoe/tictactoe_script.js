var main_css = 'main_css_element';
if (!document.getElementById(main_css))
{
    document.getElementById("default_css").remove();   
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.id=main_css;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    if (document.cookie.includes("darkmode=true"))
        link.href = '/css/games/tictactoe/tictactoe_styledark.css';
    else
        link.href = '/css/games/tictactoe/tictactoe_style.css';
    link.media = 'all';
    head.appendChild(link);
}



$.ajax({
    type: 'GET',
    method: 'GET',
    url: "/games/tic-tac-toe/list_room",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    timeout: 2000,
}).always((response) => {
    console.log(response);
    if (response.responseJSON != undefined) {
        document.getElementById("room_check").style.color = "red";
        document.getElementById("room_check").innerHTML = response.responseJSON.message;
    } else {
        response.data = JSON.parse(response.data);
        html = ``
        for (var i = 0; i < response.data.length; i++) {    
            html += `
            <div id="game_id" class="game_element">
            <ul>
              <li>
                <p class="game_info_text" style="margin-left: 100px;">nom du créateur de la partie : </p>
                <p class="game_info_text">${response.data[i].creator_name}</p>
                <p class="game_info_text" style="margin-left: 100px;">ID de la partie : </p>
                <p class="game_info_text">${response.data[i].room_id}</p>
              </li>
              <li>
              <button onclick="join_game(${response.data[i].room_id})" class="game_elem_button">Rejoindre une partie privé</button>
            </li>
            </ul>
          </div>
          `
        }
        document.getElementById("games_list").innerHTML = html;

    }
})

function join_game(room_id) {
    document.getElementById("game_redirect").href = "/games/tic-tac-toe/room/" + room_id;
    document.getElementById("game_redirect").click();
}

function create_room() {
    $.ajax({
        type: 'POST',
        method: 'POST',
        url: "/games/tic-tac-toe/create_room",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        console.log(response);
        if (response.responseJSON != undefined) {
            document.getElementById("room_check").style.color = "red";
            document.getElementById("room_check").innerHTML = response.responseJSON.message;
        } else {
            document.getElementById("room_check").style.color = "green";
            document.getElementById("room_check").innerHTML = response.message;
            setTimeout (() => {
                document.getElementById("room_check").innerHTML = "";
                document.getElementById("room_check").style.color = "";
            }, 6000);
            setTimeout (() => {
                document.getElementById("game_redirect").href = "/games/tic-tac-toe/room/" + response.data.public_session_id;
                document.getElementById("game_redirect").click();
            }, 3000);
        }
        setTimeout(() => {
            document.getElementById("room_check").innerHTML = "";
            document.getElementById("room_check").style.color = "";
        }, 6000);
    })
}