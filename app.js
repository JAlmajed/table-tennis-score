document.addEventListener("DOMContentLoaded", function () {


let score1 = 0;
let score2 = 0;

let sets1 = 0;
let sets2 = 0;

let setNumber = 1;

let server = 1;

let startingServerPlayer = 1;

let pointHistory = [];

let matchFinished = false;


const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");

const sets1El = document.getElementById("sets1");
const sets2El = document.getElementById("sets2");

const setNumberEl = document.getElementById("setNumber");

const bulb1 = document.getElementById("bulb1");
const bulb2 = document.getElementById("bulb2");

const serve1 = document.getElementById("serve1");
const serve2 = document.getElementById("serve2");

const message = document.getElementById("message");

const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");

const bestOf = document.getElementById("bestOf");

const startingServerButton =
    document.getElementById("startingServer");

const newPlayerName =
    document.getElementById("newPlayerName");

const addPlayerButton =
    document.getElementById("addPlayer");

const deletePlayerButton =
    document.getElementById("deletePlayer");


function getPlayers() {

    return JSON.parse(
        localStorage.getItem("tableTennisPlayers") || "[]"
    );

}


function savePlayers(players) {

    localStorage.setItem(
        "tableTennisPlayers",
        JSON.stringify(players)
    );

}


function updateStartingServerButton() {

    if (startingServerPlayer === 1) {

        startingServerButton.textContent =
            "🏓 " +
            player1Name.value +
            " Serves First";

    } else {

        startingServerButton.textContent =
            "🏓 " +
            player2Name.value +
            " Serves First";

    }

}


function updatePlayerDropdowns() {

    const players = getPlayers();

    const currentPlayer1 = player1Name.value;
    const currentPlayer2 = player2Name.value;


    player1Name.innerHTML = "";
    player2Name.innerHTML = "";


    if (players.length === 0) {

        const option1 =
            document.createElement("option");

        option1.value = "Player 1";
        option1.textContent = "Player 1";

        const option2 =
            document.createElement("option");

        option2.value = "Player 2";
        option2.textContent = "Player 2";

        player1Name.appendChild(option1);
        player2Name.appendChild(option2);

        updateStartingServerButton();

        return;
    }


    players.forEach(function (name) {

        const option1 =
            document.createElement("option");

        option1.value = name;
        option1.textContent = name;

        player1Name.appendChild(option1);


        const option2 =
            document.createElement("option");

        option2.value = name;
        option2.textContent = name;

        player2Name.appendChild(option2);

    });


    if (players.includes(currentPlayer1)) {

        player1Name.value = currentPlayer1;

    } else {

        player1Name.value = players[0];

    }


    if (
        players.includes(currentPlayer2) &&
        currentPlayer2 !== player1Name.value
    ) {

        player2Name.value = currentPlayer2;

    } else {

        const differentPlayer =
            players.find(function (name) {
                return name !== player1Name.value;
            });


        if (differentPlayer) {
            player2Name.value = differentPlayer;
        } else {
            player2Name.value = players[0];
        }

    }


    preventSamePlayer();

    updateStartingServerButton();

}


function preventSamePlayer() {

    const selected1 = player1Name.value;
    const selected2 = player2Name.value;


    Array.from(
        player2Name.options
    ).forEach(function (option) {

        option.disabled =
            option.value === selected1;

    });


    Array.from(
        player1Name.options
    ).forEach(function (option) {

        option.disabled =
            option.value === selected2;

    });


    if (selected1 === selected2) {

        const differentPlayer =
            getPlayers().find(function (name) {
                return name !== selected1;
            });


        if (differentPlayer) {

            player2Name.value =
                differentPlayer;

        }

    }

}


player1Name.addEventListener(
    "change",
    function () {

        if (
            player1Name.value ===
            player2Name.value
        ) {

            const differentPlayer =
                getPlayers().find(function (name) {
                    return name !== player1Name.value;
                });


            if (differentPlayer) {

                player2Name.value =
                    differentPlayer;

            }

        }


        preventSamePlayer();

        updateStartingServerButton();

    }
);


player2Name.addEventListener(
    "change",
    function () {

        if (
            player2Name.value ===
            player1Name.value
        ) {

            const differentPlayer =
                getPlayers().find(function (name) {
                    return name !== player2Name.value;
                });


            if (differentPlayer) {

                player1Name.value =
                    differentPlayer;

            }

        }


        preventSamePlayer();

        updateStartingServerButton();

    }
);


startingServerButton.addEventListener(
    "click",
    function () {

        startingServerPlayer =
            startingServerPlayer === 1
                ? 2
                : 1;


        server =
            startingServerPlayer;


        updateStartingServerButton();

        updateScreen();

    }
);


function addPlayer() {

    const name =
        newPlayerName.value.trim();


    if (name === "") {

        alert("Enter a player name.");

        return;

    }


    let players = getPlayers();


    if (players.includes(name)) {

        alert("This player already exists.");

        return;

    }


    players.push(name);

    savePlayers(players);


    updatePlayerDropdowns();


    player1Name.value = name;


    const differentPlayer =
        players.find(function (player) {
            return player !== name;
        });


    if (differentPlayer) {

        player2Name.value =
            differentPlayer;

    }


    preventSamePlayer();

    updateStartingServerButton();


    newPlayerName.value = "";

}


function deleteSelectedPlayer() {

    const selected1 =
        player1Name.value;

    const selected2 =
        player2Name.value;


    const playerToDelete =
        document.activeElement === player2Name
            ? selected2
            : selected1;


    const players =
        getPlayers();


    if (!players.includes(playerToDelete)) {

        alert("Select a saved player first.");

        return;

    }


    const confirmed =
        confirm(
            'Delete "' +
            playerToDelete +
            '"?'
        );


    if (!confirmed) {
        return;
    }


    const updatedPlayers =
        players.filter(function (name) {
            return name !== playerToDelete;
        });


    savePlayers(updatedPlayers);


    updatePlayerDropdowns();


    if (
        player1Name.value ===
        playerToDelete
    ) {

        player1Name.value =
            updatedPlayers[0] ||
            "Player 1";

    }


    if (
        player2Name.value ===
        playerToDelete
    ) {

        player2Name.value =
            updatedPlayers[1] ||
            updatedPlayers[0] ||
            "Player 2";

    }


    preventSamePlayer();

    updateStartingServerButton();

}


addPlayerButton.addEventListener(
    "click",
    addPlayer
);


deletePlayerButton.addEventListener(
    "click",
    deleteSelectedPlayer
);


document.getElementById("point1")
    .addEventListener(
        "click",
        function () {
            addPoint(1);
        }
    );


document.getElementById("point2")
    .addEventListener(
        "click",
        function () {
            addPoint(2);
        }
    );


function addPoint(player) {

    if (matchFinished) {
        return;
    }


    pointHistory.push({

        score1: score1,
        score2: score2,

        sets1: sets1,
        sets2: sets2,

        setNumber: setNumber,

        server: server,

        message: message.textContent

    });


    if (player === 1) {
        score1++;
    } else {
        score2++;
    }


    updateServer();

    checkSet();

    updateScreen();

}


function updateServer() {

    const total =
        score1 + score2;


    if (
        score1 >= 10 &&
        score2 >= 10
    ) {

        const changes =
            total - 20;


        if (changes % 2 === 0) {

            server =
                startingServerPlayer;

        } else {

            server =
                startingServerPlayer === 1
                    ? 2
                    : 1;

        }

        return;

    }


    const serviceBlock =
        Math.floor(total / 2);


    if (serviceBlock % 2 === 0) {

        server =
            startingServerPlayer;

    } else {

        server =
            startingServerPlayer === 1
                ? 2
                : 1;

    }

}


function checkSet() {

    let winner = 0;


    if (
        score1 >= 11 &&
        score1 - score2 >= 2
    ) {

        winner = 1;

    }


    if (
        score2 >= 11 &&
        score2 - score1 >= 2
    ) {

        winner = 2;

    }


    if (winner === 0) {
        return;
    }


    const winnerName =
        winner === 1
            ? player1Name.value
            : player2Name.value;


    if (winner === 1) {
        sets1++;
    } else {
        sets2++;
    }


    message.textContent =
        winnerName +
        " wins Set " +
        setNumber +
        "!";


    const totalSets =
        Number(bestOf.value);


    const setsNeeded =
        Math.ceil(totalSets / 2);


    if (
        sets1 >= setsNeeded ||
        sets2 >= setsNeeded
    ) {

        matchFinished = true;


        const matchWinner =
            sets1 > sets2
                ? player1Name.value
                : player2Name.value;


        message.textContent =
            "🏆 " +
            matchWinner +
            " WINS THE MATCH!";


        updateScreen();

        return;

    }


    setNumber++;

    score1 = 0;
    score2 = 0;


    startingServerPlayer =
        startingServerPlayer === 1
            ? 2
            : 1;


    server =
        startingServerPlayer;


    updateStartingServerButton();

}


function updateScreen() {

    score1El.textContent =
        score1;

    score2El.textContent =
        score2;

    sets1El.textContent =
        sets1;

    sets2El.textContent =
        sets2;

    setNumberEl.textContent =
        setNumber;


    if (server === 1) {

        bulb1.classList.add("active");
        bulb2.classList.remove("active");

        serve1.textContent =
            "SERVING";

        serve2.textContent =
            "NOT SERVING";

    } else {

        bulb1.classList.remove("active");
        bulb2.classList.add("active");

        serve1.textContent =
            "NOT SERVING";

        serve2.textContent =
            "SERVING";

    }

}


document.getElementById("undo")
    .addEventListener(
        "click",
        function () {

            if (
                pointHistory.length === 0
            ) {
                return;
            }


            const previous =
                pointHistory.pop();


            score1 =
                previous.score1;

            score2 =
                previous.score2;

            sets1 =
                previous.sets1;

            sets2 =
                previous.sets2;

            setNumber =
                previous.setNumber;

            server =
                previous.server;

            message.textContent =
                previous.message;

            matchFinished = false;


            updateScreen();

        }
    );


document.getElementById("swap")
    .addEventListener(
        "click",
        function () {

            const tempName =
                player1Name.value;

            player1Name.value =
                player2Name.value;

            player2Name.value =
                tempName;


            const tempScore =
                score1;

            score1 =
                score2;

            score2 =
                tempScore;


            const tempSets =
                sets1;

            sets1 =
                sets2;

            sets2 =
                tempSets;


            server =
                server === 1
                    ? 2
                    : 1;


            startingServerPlayer =
                startingServerPlayer === 1
                    ? 2
                    : 1;


            preventSamePlayer();

            updateStartingServerButton();

            updateScreen();

        }
    );


document.getElementById("newMatch")
    .addEventListener(
        "click",
        function () {

            score1 = 0;
            score2 = 0;

            sets1 = 0;
            sets2 = 0;

            setNumber = 1;

            server =
                startingServerPlayer;

            pointHistory = [];

            matchFinished = false;

            message.textContent = "";


            updateStartingServerButton();

            updateScreen();

        }
    );


updatePlayerDropdowns();

updateStartingServerButton();

updateScreen();


});
