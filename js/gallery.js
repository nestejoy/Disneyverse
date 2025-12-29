const API_BASE_URL = "https://api.disneyapi.dev/character?page=";
    const PAGE_SIZE = 50;
    let allCharacters = []; // Store all fetched characters
    const searchDropdown = document.getElementById("searchCharacterName");

    searchDropdown.disabled = true;

    async function fetchAllCharacters() {
        console.log("Starting fetchAllCharacters..."); 
        let page = 1; 
        const totalPages = 20; 
        let characters = [];

        while (page <= totalPages) {
            try {
                console.log(`Fetching page ${page}...`); 

                const response = await fetch(`${API_BASE_URL}${page}&pageSize=${PAGE_SIZE}`);
                
                if (!response.ok) {
                    console.error(`Error fetching page ${page}:`, response.statusText);
                    break;
                }

                const data = await response.json();

                characters = characters.concat(data.data);

                console.log(`Page ${page} fetched successfully. Characters so far: ${characters.length}`);
                
                page++;
            } catch (error) {
                console.error(`Error fetching characters on page ${page}:`, error);
                break;
            }
        }

        return characters; 
    }

    async function logCharacterNames() {
        console.log("Starting logCharacterNames..."); 
        const characters = await fetchAllCharacters(); 
        
        if (characters.length === 0) {
            console.error("No characters retrieved.");
            return;
        }

        console.log(`Total Characters Retrieved: ${characters.length}`);
        console.log("Disney Characters:");

        characters.forEach(character => console.log(character.name));

        populateDropdown(characters);
    }

    function populateDropdown(characters) {
        searchDropdown.innerHTML = "<option value=\"\" hidden>Select a character</option>"; // Reset options

        characters.forEach(character => {
            const option = document.createElement("option");
            option.value = character._id;
            option.textContent = character.name;
            searchDropdown.appendChild(option);
        });


        // Enable the dropdown after population
        searchDropdown.disabled = false;
        console.log("Dropdown is now enabled.");
    }

    function populateCharacters(characters) {
        const characterList = document.getElementById('character-list');
        characterList.innerHTML = '';

        characters.forEach(character => {
            const characterItem = document.createElement('a');
            characterItem.href = `details.html?characterId=${character._id}`; 
            characterItem.className = 'scroll-item';

            const imageUrl = character.imageUrl && character.imageUrl.trim() !== '' 
                ? character.imageUrl 
                : '../images/default.jfif';

            characterItem.innerHTML = `
                <div class="image-container">
                    <img src="${imageUrl}" alt="${character.name} Image" onerror="this.src='../images/default.jfif'">
                </div>
                <h2>${character.name}</h2>
                <span class="scroll-item-tvShow">${character.tvShows?.join(', ') || 'TV Show: Unknown'}</span>
            `;

            characterList.appendChild(characterItem);
        });
    }

    const searchInput = document.getElementById('searchCharacterName');
    searchInput.addEventListener('change', function () {
        const selectedCharacterId = this.value;
        if (selectedCharacterId) {
            // Redirect to details page when an option is clicked
            window.location.href = `details.html?characterId=${selectedCharacterId}`;
        }
    });

    async function populateSearchDropdown() {
        try {
            const response = await fetch("https://api.disneyapi.dev/character");
            const data = await response.json();
            const characters = data.data;

            const searchDropdown = document.getElementById("searchCharacterName");
            characters.forEach(character => {
                const option = document.createElement("option");
                option.value = character._id;
                option.text = character.name;
                searchDropdown.appendChild(option);
            });


        } catch (error) {
            console.error("Error populating search dropdown:", error);
        }
    }

    logCharacterNames();







document.addEventListener("DOMContentLoaded", () => {
    const characterList = document.getElementById("character-list");
    const apiUrl = "https://api.disneyapi.dev/character";
    const currentPageDisplay = document.getElementById("current-page");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const pageButtons = document.querySelectorAll(".page-button");
    const pageInput = document.getElementById("page-input");
    let currentPage = 1; 
    const maxPage = 150; 

    // Fetch character data
    async function fetchCharacters(page) {
        try {
            const response = await fetch(`${apiUrl}?page=${page}&pageSize=50`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            renderCharacters(data.data);
            updatePagination(page);

            


        } catch (error) {
            console.error("Error fetching characters:", error);
            characterList.innerHTML = "<p>Error loading characters. Please try again later.</p>";
        }
    }

    // Render characters
function renderCharacters(characters) {
    characterList.innerHTML = "";
    characters.forEach((character, index) => {
        const scrollItem = document.createElement("a");
        scrollItem.href = "#";
        scrollItem.className = "scroll-item";

        const imageContainer = document.createElement("div");
        imageContainer.className = "image-container";

        const image = document.createElement("img");
        image.src = character.imageUrl && character.imageUrl.trim() !== '' 
            ? character.imageUrl 
            : "../images/default.jfif";
        image.alt = `${character.name} Image`;
        image.onerror = function() { this.src = '../images/default.jfif'; };

        const characterName = document.createElement("h1");
        characterName.textContent = character.name;

        imageContainer.appendChild(image);
        scrollItem.appendChild(imageContainer);
        scrollItem.appendChild(characterName);

        characterList.appendChild(scrollItem);

        scrollItem.addEventListener('click', () => {
            if (character._id) {
                window.location.href = `details.html?characterId=${character._id}`;
            } else {
                alert("Character ID is missing.");
            }
        });
    });
}

    function updatePagination(page) {
        currentPage = page;
        currentPageDisplay.textContent = `Page ${page}`;

        pageButtons.forEach(button => {
            const btnPage = parseInt(button.dataset.page);
            if (btnPage === page) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        });

        prevPageButton.disabled = currentPage === 1;
        prevPageButton.style.cursor = prevPageButton.disabled ? "not-allowed" : "pointer";

        nextPageButton.disabled = currentPage === maxPage;
        nextPageButton.style.cursor = nextPageButton.disabled ? "not-allowed" : "pointer";
    }

    // Event listeners for navigation
    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            fetchCharacters(currentPage - 1);
        }
    });

    nextPageButton.addEventListener("click", () => {
        if (currentPage < maxPage) {
            fetchCharacters(currentPage + 1);
        }
    });

    pageButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedPage = parseInt(button.dataset.page);
            if (selectedPage !== currentPage) {
                fetchCharacters(selectedPage);
            }
        });
    });

    document.addEventListener("DOMContentLoaded", async () => {
    try {
        const initialCharacters = await fetchCharacters(1); // Load page 1
        if (initialCharacters && initialCharacters.length > 0) {
            populateCharacters(initialCharacters);
        } else {
            console.warn("No characters found on initial load.");
        }
    } catch (error) {
        console.error("Error during initial character load:", error);
    }
});

    fetchCharacters(currentPage);
});

function populateCharacters(characters) {
    const characterList = document.getElementById('character-list');
    characterList.innerHTML = ''; // Clear existing items

    characters.forEach(character => {
        const characterItem = document.createElement('a');
        if (character._id) {
            characterItem.href = `details.html?characterId=${character._id}`;
        } else {
            console.warn("Character missing ID:", character);
            characterItem.href = "#";
        }

        characterItem.className = 'scroll-item'; 
        characterItem.style.textDecoration = 'none'; 

        const imageUrl = character.imageUrl && character.imageUrl.trim() !== '' 
            ? character.imageUrl 
            : '../images/default.jfif';

        characterItem.innerHTML = `
            <div class="image-container">
                <img src="${imageUrl}" 
                     alt="${character.name || 'Character Image'}" 
                     style="width: 100%; height: auto; border-radius: 8px;"
                     onerror="this.src='../images/default.jfif'">
            </div>
            <h2 style="text-align: center; color: #31393d;">${character.name || 'Unknown'}</h2>
        `;

        characterList.appendChild(characterItem);
    });

    console.log("Characters rendered successfully.");
}

