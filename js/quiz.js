const API_BASE_URL = "https://api.disneyapi.dev/character?page=";
const PAGE_SIZE = 50;
let allCharacters = []; // Store all fetched characters
const searchDropdown = document.getElementById("searchCharacterName");

searchDropdown.disabled = true;

async function isValidImage(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

async function fetchAllCharacters() {
    console.log("Starting fetchAllCharacters...");
    let page = 1;
    const totalPages = 20;

    while (page <= totalPages) {
        try {
            console.log(`Fetching page ${page}...`);
            const response = await fetch(`${API_BASE_URL}${page}&pageSize=${PAGE_SIZE}`);
            if (!response.ok) {
                console.error(`Error fetching page ${page}:`, response.statusText);
                break;
            }

            const data = await response.json();
            for (const character of data.data) {
                if (character.imageUrl && character.imageUrl.trim() !== "" && await isValidImage(character.imageUrl)) {
                    allCharacters.push(character);
                }
            }
            console.log(`Page ${page} fetched successfully. Characters with valid images: ${allCharacters.length}`);
            page++;
        } catch (error) {
            console.error(`Error fetching characters on page ${page}:`, error);
            break;
        }
    }
}

function populateDropdown() {
    searchDropdown.innerHTML = '<option value="" hidden>Select a character</option>'; // Reset options

    allCharacters.forEach((character) => {
        const option = document.createElement("option");
        option.value = character._id;
        option.textContent = character.name;
        searchDropdown.appendChild(option);
    });

    searchDropdown.disabled = false;
    console.log("Dropdown is now enabled.");
}

searchDropdown.addEventListener("change", function () {
    const selectedCharacterId = this.value;
    if (selectedCharacterId) {
        window.location.href = `details.html?characterId=${selectedCharacterId}`;
    }
});

async function initialize() {
    await fetchAllCharacters();
    populateDropdown();
}
initialize();

let difficulty = null;
let totalQuestions = 0;
let currentQuestion = 0;
let score = 0;
let lives = 0;
let maxLives = 0;
let multiplier = 1;
let totalPoints = 0;

function setDifficulty(level) {
    difficulty = level;
    switch (level) {
        case "easy":
            totalQuestions = 10;
            multiplier = 1;
            lives = -1; // Unlimited lives
            maxLives = -1;
            break;
        case "intermediate":
            totalQuestions = 20;
            multiplier = 1.5;
            lives = 5;
            maxLives = 5;
            break;
        case "advanced":
            totalQuestions = 30;
            multiplier = 2;
            lives = 3;
            maxLives = 3;
            break;
        case "hard":
            totalQuestions = 40;
            multiplier = 3;
            lives = 1;
            maxLives = 1;
            break;
    }
    currentQuestion = 0;
    score = 0;
    totalPoints = 0;

    document.getElementById("title").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("difficulty-section").style.display = "none";
    document.getElementById("leaderboard-button-section").style.display = "none";

    startQuiz();
}

function startQuiz() {
    currentQuestion = 1;
    score = 0;
    totalPoints = 0;
    updateScoreDisplay();
    loadQuestion();
}

function updateScoreDisplay() {
    const livesText = lives === -1 ? '∞' : '❤️'.repeat(lives);
    document.getElementById("score").innerHTML = `${totalPoints} pts | Lives: ${livesText}`;
}

function loadQuestion() {
    if (allCharacters.length < 4) {
        console.error("Not enough characters with valid images for the quiz.");
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    const correctCharacter = allCharacters[randomIndex];
    const incorrectCharacters = [];
    
    while (incorrectCharacters.length < 3) {
        const randIndex = Math.floor(Math.random() * allCharacters.length);
        const candidate = allCharacters[randIndex];
        if (candidate.name !== correctCharacter.name && !incorrectCharacters.includes(candidate.name)) {
            incorrectCharacters.push(candidate.name);
        }
    }

    const allChoices = [...incorrectCharacters, correctCharacter.name].sort(() => Math.random() - 0.5);
    const quizContainer = document.getElementById("quiz-container");
    
    quizContainer.innerHTML = `
        <div class="imageContainer">
            <img src="${correctCharacter.imageUrl}" alt="Disney Character">
        </div>
        <div class="questionContainer">
            <h2>Who is this character?</h2>
            <ul id="choices" class="choices">
                ${allChoices.map(choice => `<li onclick="checkAnswer('${choice.replace(/'/g, "\\'")}'  , '${correctCharacter.name.replace(/'/g, "\\'")}')">${choice}</li>`).join("")}
            </ul>
            <div id="feedback" class="feedback"></div>
        </div>
    `;
}

function checkAnswer(selected, correct) {
    const feedback = document.getElementById("feedback");
    const choices = document.getElementById("choices");
    choices.style.pointerEvents = "none";
    
    if (selected === correct) {
        score++;
        const pointsEarned = Math.round(10 * multiplier);
        totalPoints += pointsEarned;
        feedback.innerHTML = `<p style="color: green;">Correct! +${pointsEarned} points! The character is ${correct}.</p>`;
    } else {
        if (lives !== -1) {
            lives--;
        }
        feedback.innerHTML = `<p style="color: red;">Incorrect. The correct answer is ${correct}.</p>`;
        
        // Check if out of lives
        if (lives === 0) {
            updateScoreDisplay();
            setTimeout(() => {
                gameOver();
            }, 2000);
            return;
        }
    }
    
    updateScoreDisplay();
    currentQuestion++;
    
    if (currentQuestion <= totalQuestions) {
        setTimeout(loadQuestion, 2000);
    } else {
        setTimeout(endQuiz, 2000);
    }
}

function gameOver() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <div class="scoreDisplay">
          <h2>💔 Game Over! You ran out of lives!</h2>
          <h3>You scored ${score} correct answers</h3>
          <h3>Total Points: ${totalPoints}</h3>
          <div class="name-input-container">
            <input type="text" id="playerName" placeholder="Enter your name" class="player-name-input">
            <button onclick="saveToLeaderboard()" class="btn">Save Score</button>
          </div>
          <div class="button-row">
            <button onclick="backToDifficultySelection()" class="btn">Try Again</button>
            <button onclick="showLeaderboard()" class="btn">View Leaderboard</button>
          </div>
        </div>
    `;
    document.getElementById("score-container").style.display = "block";
}

function endQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    const livesBonus = lives === -1 ? 0 : lives * 10 * multiplier;
    totalPoints += Math.round(livesBonus);
    
    quizContainer.innerHTML = `
        <div class="scoreDisplay">
          <h2>🎉 Quiz Complete!</h2>
          <h3>You scored ${score} out of ${totalQuestions}</h3>
          <h3>Total Points: ${totalPoints} ${livesBonus > 0 ? `(+${Math.round(livesBonus)} lives bonus!)` : ''}</h3>
          <p>Difficulty: ${difficulty}</p>
          <div class="name-input-container">
            <input type="text" id="playerName" placeholder="Enter your name" class="player-name-input">
            <button onclick="saveToLeaderboard()" class="btn">Save Score</button>
          </div>
          <div class="button-row">
            <button onclick="backToDifficultySelection()" class="btn">Back to Difficulty Selection</button>
            <button onclick="showLeaderboard()" class="btn">View Leaderboard</button>
          </div>
        </div>
    `;
    document.getElementById("score-container").style.display = "block";
}

function saveToLeaderboard() {
    const playerName = document.getElementById("playerName").value.trim();
    if (!playerName) {
        showModal("error", "Oops!", "Please enter your name to save your score.");
        return;
    }

    const leaderboard = JSON.parse(localStorage.getItem("disneyQuizLeaderboard")) || [];
    
    const entry = {
        name: playerName,
        score: score,
        totalQuestions: totalQuestions,
        totalPoints: totalPoints,
        difficulty: difficulty,
        multiplier: multiplier,
        percentage: Math.round((score / totalQuestions) * 100),
        date: new Date().toLocaleDateString()
    };
    
    leaderboard.push(entry);
    leaderboard.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0) || b.percentage - a.percentage);
    
    // Keep only top 10 scores
    if (leaderboard.length > 10) {
        leaderboard.length = 10;
    }
    
    localStorage.setItem("disneyQuizLeaderboard", JSON.stringify(leaderboard));
    
    showModal("success", "Score Saved!", `Congratulations ${playerName}! Your score of ${totalPoints} points has been saved to the leaderboard.`, showLeaderboard);
    showLeaderboard();
}

function showLeaderboard() {
    // Hide the main quiz elements when showing leaderboard
    document.getElementById("title").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("difficulty-section").style.display = "none";
    document.getElementById("leaderboard-button-section").style.display = "none";
    document.getElementById("score-container").style.display = "none";
    
    const leaderboard = JSON.parse(localStorage.getItem("disneyQuizLeaderboard")) || [];
    const quizContainer = document.getElementById("quiz-container");
    
    let leaderboardHTML = `
        <div class="leaderboard-container">
            <h2>🏆 Leaderboard 🏆</h2>
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Points</th>
                        <th>Score</th>
                        <th>Difficulty</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    if (leaderboard.length === 0) {
        leaderboardHTML += `<tr><td colspan="6">No scores yet. Be the first!</td></tr>`;
    } else {
        leaderboard.forEach((entry, index) => {
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : (index + 1);
            leaderboardHTML += `
                <tr>
                    <td>${medal}</td>
                    <td>${entry.name}</td>
                    <td>${entry.totalPoints || 0}</td>
                    <td>${entry.score}/${entry.totalQuestions}</td>
                    <td>${entry.difficulty}</td>
                    <td>${entry.date}</td>
                </tr>
            `;
        });
    }
    
    leaderboardHTML += `
                </tbody>
            </table>
            <button onclick="backToDifficultySelection()" class="btn">Play Again</button>
        </div>
    `;
    
    quizContainer.innerHTML = leaderboardHTML;
}

function backToDifficultySelection() {
    document.getElementById("title").style.display = "";
    document.getElementById("instructions").style.display = "";
    document.getElementById("difficulty-section").style.display = "";
    document.getElementById("leaderboard-button-section").style.display = "";
    document.getElementById("score-container").style.display = "none";

    difficulty = null;
    totalQuestions = 0;
    currentQuestion = 0;
    score = 0;
    lives = 0;
    maxLives = 0;
    multiplier = 1;
    totalPoints = 0;
    
    document.getElementById("quiz-container").innerHTML = "";
}

// Custom Modal Popup
function showModal(type, title, message, callback = null) {
    const icon = type === "success" ? "✨" : "⚠️";
    const modalClass = type === "success" ? "modal-success" : "modal-error";
    
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal(event, ${callback ? 'true' : 'false'})">
            <div class="modal-content ${modalClass}" onclick="event.stopPropagation()">
                <div class="modal-icon">${icon}</div>
                <h2 class="modal-title">${title}</h2>
                <p class="modal-message">${message}</p>
                <button class="modal-btn" onclick="closeModal(event, ${callback ? 'true' : 'false'})">OK</button>
            </div>
        </div>
    `;
    
    // Store callback for later
    window.modalCallback = callback;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal(event, hasCallback) {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        if (hasCallback && window.modalCallback) {
            window.modalCallback();
            window.modalCallback = null;
        }
    }
}