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

            characterItem.innerHTML = `
                <div class="image-container">
                    <img src="${character.imageUrl || 'https://via.placeholder.com/150'}" alt="${character.name} Image">
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






        async function fetchCharacterDetails() {
            const urlParams = new URLSearchParams(window.location.search);
            const characterId = urlParams.get("characterId"); 

            console.log("Extracted Character ID:", characterId);
            if (!characterId) {
                alert("Character ID is missing in the URL.");
                return;
            }

            try {
                const response = await fetch(`https://api.disneyapi.dev/character/${characterId}`);
                console.log("Fetch Response Status:", response.status); 

                if (!response.ok) {
                    console.error("Error fetching character details:", response.statusText);
                    alert("Failed to fetch character details. Please try again later.");
                    return;
                }

                const data = await response.json();
                console.log("Fetched Data:", data);

                displayCharacterDetails(data.data);
            } catch (error) {
                console.error("Error occurred while fetching character details:", error);
                alert("An error occurred while fetching character details. Please try again later.");
            }
        }

        function displayCharacterDetails(character) {
            const detailsDiv = document.getElementById("characterDetails");

            if (character) {
                detailsDiv.innerHTML = `
                <div class="detailsContainer">
                <div class="detailsholder1">
                    <h2>${character.name || "Unknown"}</h2>
                    <img src="${character.imageUrl || 'https://via.placeholder.com/150'}" 
                         alt="${character.name || 'Character Image'}" 
                         style="max-width: 400px; height: 300px; margin-bottom: 20px;">
                </div>
                <div class="detailsholder2">
                    <p><strong>Films:</strong> ${character.films?.join(', ') || "None"}</p>
                    <p><strong>Short Films:</strong> ${character.shortFilms?.join(', ') || "None"}</p>
                    <p><strong>TV Shows:</strong> ${character.tvShows?.join(', ') || "None"}</p>
                    <p><strong>Video Games:</strong> ${character.videoGames?.join(', ') || "None"}</p>
                </div
                </div>
                `;
            } else {
                detailsDiv.innerHTML = `<p>Character details not found.</p>`;
            }
        }

        window.onload = fetchCharacterDetails;