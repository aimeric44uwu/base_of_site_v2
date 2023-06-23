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

function leave_game() {
    console.log(window.location.href);
    $.ajax({
        type: 'DELETE',
        method: 'DELETE',
        url: window.location.href,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        console.log(response);
        if (response.responseJSON != undefined) {
            document.getElementById("room_check").style.color = "red";
            document.getElementById("room_check").innerHTML = response.responseJSON.message;
            if (response.responseJSON.status == "error") {
                document.getElementById("game_redirect").href = "/games/tic-tac-toe";
                document.getElementById("game_redirect").click();
            }
        } else {
            document.getElementById("room_check").style.color = "green";
            document.getElementById("room_check").innerHTML = response.message;
            setTimeout (() => {
                document.getElementById("room_check").innerHTML = "";
                document.getElementById("room_check").style.color = "";
            }, 6000);
            setTimeout (() => {
                document.getElementById("game_redirect").href = "/games/tic-tac-toe";
                document.getElementById("game_redirect").click();
            }, 3000);
        }
        setTimeout(() => {
            document.getElementById("room_check").innerHTML = "";
            document.getElementById("room_check").style.color = "";
        }, 6000);
    })
}