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

let timeremaining_sec = -1;
let timerupdatedend = false;

function leave_game() {
    $.ajax({
        type: 'DELETE',
        method: 'DELETE',
        url: window.location.href,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
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

function place_pos(pos)
{
    pos = parseInt(pos);
    const crosshtml = `
        <div class="placed-element">
        <div class="cross-one"></div>
        <div class="cross-two"></div>
        </div>`;
    const circlehtml = `
        <div class="placed-element">
        <div class="circle-one"></div>
        <div class="circle-two"></div>
        </div>`;
    $.ajax({
        type: 'PUT',
        method: 'PUT',
        url: window.location.href,
        data: JSON.stringify({"pos": pos}),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        if (response.responseJSON != undefined) {
            document.getElementById("room_check").style.color = "red";
            document.getElementById("room_check").innerHTML = response.responseJSON.message;
        } else {
            document.getElementById("room_check").style.color = "green";
            document.getElementById("room_check").innerHTML = response.message;
            getplayedpos();
        }
        setTimeout (() => {
            document.getElementById("room_check").innerHTML = "";
        }, 4000);
    })
}

function getplayedpos()
{
    const crosshtml = `
        <div class="placed-element">
        <div class="cross-one"></div>
        <div class="cross-two"></div>
        </div>`;
    const circlehtml = `
        <div class="placed-element">
        <div class="circle-one"></div>
        <div class="circle-two"></div>
        </div>`;
    $.ajax({
        type: 'GET',
        method: 'GET',
        url: window.location.href + "/playedpos",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        timeout: 2000,
    }).always((response) => {
        console.log(response);
        if (response.responseJSON == undefined) {
            if (response.isfinished == true) {
                document.getElementById("games_tatus").style.color = "green";
                if (response.winner != null && response.winner != undefined && timerupdatedend == false && (timeremaining_sec > 60 || timeremaining_sec < 30)) {
                    timeremaining_sec = 60;
                    timerupdatedend = true;
                }
                if (response.winner == "you") {
                    document.getElementById("games_tatus").innerHTML = `La partie est terminé , vous avez gagné`;
                } else if (response.winner == "enemy") {
                    document.getElementById("games_tatus").innerHTML = `La partie est terminé , l'enemy a gagné`;
                } else if (response.winner == "draw") {
                    document.getElementById("games_tatus").innerHTML = `La partie est terminé , match nul`;
                }
            }
            if (timeremaining_sec == -1)
                timeremaining_sec = parseInt(response.timeremaining) / 1000;
            if (response.turn == "your_turn" && response.winner != null && response.winner != undefined) {
                document.getElementById("turn_info").style.color = "green";
                document.getElementById("turn_info").innerHTML = "C'est votre tour";
            } else if (response.turn == "not_your_turn" && response.winner != null && response.winner != undefined) {
                document.getElementById("turn_info").style.color = "black";
                document.getElementById("turn_info").innerHTML = "C'est le tour de votre adversaire";
            } else {
                document.getElementById("turn_info").innerHTML = "";
            }
            for (var i = 0; i < Object.keys(response.data[0]).length; i++) {
                if (response.data[0][Object.keys(response.data[0])[i]][0].sign == "cross") {
                   document.getElementById("pos" + Object.keys(response.data[0])[i]).innerHTML = crosshtml;
                } else if (response.data[0][Object.keys(response.data[0])[i]][0].sign == "circle") {
                    document.getElementById("pos" + Object.keys(response.data[0])[i]).innerHTML = circlehtml;
                } else {
                    document.getElementById("pos" + Object.keys(response.data[0])[i]).innerHTML = "";
                }
            }
        }
    })
}

function updatetimer()
{
    timeremaining_sec -= 1;
    if (timeremaining_sec <= 0) {
        timeremaining_sec = 0;
        leave_game()

    }
    console.log(timeremaining_sec);
    var minutes = (timeremaining_sec / 60) | 0;
    var seconds = (timeremaining_sec % 60) | 0;
    document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";

}


getplayedpos();

setInterval(() => {
    getplayedpos();
    updatetimer();
}, 1000);
