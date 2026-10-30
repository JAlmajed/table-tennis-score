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
    const startingServerButton = document.getElementById("startingServer");
    const newPlayerName = document.getElementById("newPlayerName");
    const addPlayerButton = document.getElementById("addPlayer");
    const deletePlayerButton = document.getElementById("deletePlayer");

    const PLACEHOLDER1 = "Select Player 1";
    const PLACEHOLDER2 = "Select Player 2";

    // Remember which dropdown the user touched last, so "Delete Player"
    // targets it (the button itself steals focus on most browsers).
    let lastUsedPlayerSelect = player1Name;

    [player1Name, player2Name].forEach(function (select) {
        select.addEventListener("focus", function () {
            lastUsedPlayerSelect = select;
        });
        select.addEventListener("change", function () {
            lastUsedPlayerSelect = select;
        });
    });

    function getPlayers() {
        return JSON.parse(
            localStorage.getItem("tableTennisPlayers") || "[]"
        ).filter(function (name) {
            return name !== "Player 1" &&
                   name !== "Player 2" &&
                   name !== PLACEHOLDER1 &&
                   name !== PLACEHOLDER2;
        });
    }

    function savePlayers(players) {
        localStorage.setItem(
            "tableTennisPlayers",
            JSON.stringify(
                players.filter(function (name) {
                    return name !== "Player 1" &&
                           name !== "Player 2" &&
                           name !== PLACEHOLDER1 &&
                           name !== PLACEHOLDER2;
                })
            )
        );
    }

    function updateStartingServerButton() {
        if (!player1Name.value || !player2Name.value) {
            startingServerButton.textContent =
                "Select both players first";
            return;
        }

        const startingPlayer = startingServerPlayer === 1
            ? player1Name.value
            : player2Name.value;

        startingServerButton.textContent =
            startingPlayer + " serves first";
    }

    function updatePlayerDropdowns(resetSelection = false) {
        const players = getPlayers();

        const currentPlayer1 = resetSelection ? "" : player1Name.value;
        const currentPlayer2 = resetSelection ? "" : player2Name.value;

        player1Name.innerHTML = "";
        player2Name.innerHTML = "";

        // Placeholder options
        const placeholder1 = new Option(PLACEHOLDER1, "");
        const placeholder2 = new Option(PLACEHOLDER2, "");

        placeholder1.disabled = true;
        placeholder2.disabled = true;

        player1Name.add(placeholder1);
        player2Name.add(placeholder2);

        // Add only saved player names
        players.forEach(function (name) {
            player1Name.add(new Option(name, name));
            player2Name.add(new Option(name, name));
        });

        if (resetSelection) {
            player1Name.selectedIndex = 0;
            player2Name.selectedIndex = 0;
        } else {
            player1Name.value = players.includes(currentPlayer1)
                ? currentPlayer1
                : "";

            player2Name.value =
                players.includes(currentPlayer2) &&
                currentPlayer2 !== player1Name.value
                    ? currentPlayer2
                    : "";
        }

        preventSamePlayer();
        updateStartingServerButton();
    }

    function preventSamePlayer() {
        const selected1 = player1Name.value;
        const selected2 = player2Name.value;

        Array.from(player1Name.options).forEach(function (option) {
            if (option.value !== "") {
                option.disabled = option.value === selected2;
            }
        });

        Array.from(player2Name.options).forEach(function (option) {
            if (option.value !== "") {
                option.disabled = option.value === selected1;
            }
        });

        updateStartingServerButton();
    }

    player1Name.addEventListener("change", function () {
        if (
            player1Name.value !== "" &&
            player1Name.value === player2Name.value
        ) {
            player2Name.value = "";
        }

        preventSamePlayer();
        updateStartingServerButton();
    });

    player2Name.addEventListener("change", function () {
        if (
            player2Name.value !== "" &&
            player2Name.value === player1Name.value
        ) {
            player1Name.value = "";
        }

        preventSamePlayer();
        updateStartingServerButton();
    });

    startingServerButton.addEventListener("click", function () {
        if (!player1Name.value || !player2Name.value) {
            updateStartingServerButton();
            return;
        }

        startingServerPlayer = startingServerPlayer === 1 ? 2 : 1;
        updateServer();

        updateStartingServerButton();
        updateScreen();
    });

    function addPlayer() {
        const name = newPlayerName.value.trim();

        if (!name) {
            alert("Enter a player name.");
            return;
        }

        if (
            name === "Player 1" ||
            name === "Player 2" ||
            name === PLACEHOLDER1 ||
            name === PLACEHOLDER2
        ) {
            alert("That name is reserved for a dropdown placeholder.");
            return;
        }

        const players = getPlayers();

        if (players.includes(name)) {
            alert("This player already exists.");
            return;
        }

        players.push(name);
        savePlayers(players);
        updatePlayerDropdowns();

        player1Name.value = name;

        const differentPlayer = players.find(function (player) {
            return player !== name;
        });

        if (differentPlayer) {
            player2Name.value = differentPlayer;
        }

        preventSamePlayer();
        updateStartingServerButton();
        newPlayerName.value = "";
    }

    function deleteSelectedPlayer() {
        const playerToDelete = lastUsedPlayerSelect.value;

        const players = getPlayers();

        if (!players.includes(playerToDelete)) {
            alert("Select a saved player first.");
            return;
        }

        if (!confirm('Delete "' + playerToDelete + '"?')) {
            return;
        }

        savePlayers(
            players.filter(function (name) {
                return name !== playerToDelete;
            })
        );

        updatePlayerDropdowns();
        preventSamePlayer();
        updateStartingServerButton();
    }

    addPlayerButton.addEventListener("click", addPlayer);
    deletePlayerButton.addEventListener("click", deleteSelectedPlayer);

    document.getElementById("point1").addEventListener("click", function () {
        addPoint(1);
    });

    document.getElementById("point2").addEventListener("click", function () {
        addPoint(2);
    });

    function addPoint(player) {
        if (!player1Name.value || !player2Name.value) {
            alert("Select both players before starting the match.");
            return;
        }

        if (matchFinished) return;

        pointHistory.push({
            score1,
            score2,
            sets1,
            sets2,
            setNumber,
            server,
            startingServerPlayer,
            matchFinished,
            message: message.textContent
        });

        if (player === 1) score1++;
        else score2++;

        updateServer();
        checkSet();
        updateScreen();
    }

    function updateServer() {
        const total = score1 + score2;

        if (score1 >= 10 && score2 >= 10) {
            const changes = total - 20;

            server = changes % 2 === 0
                ? startingServerPlayer
                : (startingServerPlayer === 1 ? 2 : 1);

            return;
        }

        const serviceBlock = Math.floor(total / 2);

        server = serviceBlock % 2 === 0
            ? startingServerPlayer
            : (startingServerPlayer === 1 ? 2 : 1);
    }

    function checkSet() {
        let winner = 0;

        if (score1 >= 11 && score1 - score2 >= 2) winner = 1;
        if (score2 >= 11 && score2 - score1 >= 2) winner = 2;

        if (!winner) return;

        const winnerName = winner === 1
            ? player1Name.value
            : player2Name.value;

        if (winner === 1) sets1++;
        else sets2++;

        message.textContent =
            winnerName + " wins Set " + setNumber + "!";

        const setsNeeded = Math.ceil(Number(bestOf.value) / 2);

        if (sets1 >= setsNeeded || sets2 >= setsNeeded) {
            matchFinished = true;

            const matchWinner = sets1 > sets2
                ? player1Name.value
                : player2Name.value;

            message.textContent =
                "🏆 " + matchWinner + " WINS THE MATCH!";

            updateScreen();
            return;
        }

        setNumber++;
        score1 = 0;
        score2 = 0;

        startingServerPlayer = startingServerPlayer === 1 ? 2 : 1;
        server = startingServerPlayer;

        updateStartingServerButton();
    }

    function updateScreen() {
        score1El.textContent = score1;
        score2El.textContent = score2;
        sets1El.textContent = sets1;
        sets2El.textContent = sets2;
        setNumberEl.textContent = setNumber;

        if (server === 1) {
            bulb1.classList.add("active");
            bulb2.classList.remove("active");
            serve1.textContent = "SERVING";
            serve2.textContent = "NOT SERVING";
        } else {
            bulb1.classList.remove("active");
            bulb2.classList.add("active");
            serve1.textContent = "NOT SERVING";
            serve2.textContent = "SERVING";
        }
    }

    document.getElementById("undo").addEventListener("click", function () {
        if (pointHistory.length === 0) return;

        const previous = pointHistory.pop();

        score1 = previous.score1;
        score2 = previous.score2;
        sets1 = previous.sets1;
        sets2 = previous.sets2;
        setNumber = previous.setNumber;
        server = previous.server;
        startingServerPlayer = previous.startingServerPlayer;
        matchFinished = previous.matchFinished;
        message.textContent = previous.message;

        updateStartingServerButton();
        updateScreen();
    });

    document.getElementById("swap").addEventListener("click", function () {
        const tempName = player1Name.value;
        player1Name.value = player2Name.value;
        player2Name.value = tempName;

        [score1, score2] = [score2, score1];
        [sets1, sets2] = [sets2, sets1];

        server = server === 1 ? 2 : 1;
        startingServerPlayer = startingServerPlayer === 1 ? 2 : 1;

        // Keep undo history in the same orientation as the screen
        pointHistory = pointHistory.map(function (entry) {
            return Object.assign({}, entry, {
                score1: entry.score2,
                score2: entry.score1,
                sets1: entry.sets2,
                sets2: entry.sets1,
                server: entry.server === 1 ? 2 : 1,
                startingServerPlayer: entry.startingServerPlayer === 1 ? 2 : 1
            });
        });

        preventSamePlayer();
        updateStartingServerButton();
        updateScreen();
    });

    document.getElementById("newMatch").addEventListener("click", function () {
        score1 = 0;
        score2 = 0;
        sets1 = 0;
        sets2 = 0;
        setNumber = 1;
        startingServerPlayer = 1;
        server = 1;
        pointHistory = [];
        matchFinished = false;
        message.textContent = "";

        updatePlayerDropdowns(true);
        updateStartingServerButton();
        updateScreen();
    });

    // Initial state
    updatePlayerDropdowns(true);
    updateStartingServerButton();
    updateScreen();
});
