const wrapper = document.querySelector('.scroll-wrapper');
const el = document.querySelector('.scroll');
const filler = document.querySelector('.scroll-filler');
const position = document.querySelector('.scroll-position-inner');
const inner = document.querySelector('.scroll-inner');
const btns = {prev: document.querySelector('.scroll-btn.prev'), next: document.querySelector('.scroll-btn.next')};

const lerp = (a, b, n) => {
  return (1 - n) * a + n * b
}

const padding = 20;

let scrollNow = 0;

filler.style.width = inner.offsetWidth + padding*2 + 'px';
position.style.width = wrapper.offsetWidth / (inner.offsetWidth + padding*2) * 100 + '%';

const offset = 150;
const angle = 25;
const z = 15;

function render() {
  let now = lerp(scrollNow, wrapper.scrollLeft, .15);
  gsap.set(el, {x: -now});
  gsap.set(position, {x: now / wrapper.offsetWidth * 100 + '%'});

  document.querySelectorAll('.scroll-item').forEach(item => {
    let elPos = item.offsetLeft + item.offsetWidth / 2 - scrollNow;

    if (elPos > wrapper.offsetWidth - offset) {
      let q = (wrapper.offsetWidth - elPos) / offset;
      gsap.set(item, {rotateY: -(angle - q * angle), z: z - z * q})
    } else if (elPos < offset) {
      let q = elPos / offset;
      gsap.set(item, {rotateY: angle - q * angle, z: z - z * q})
    } else {
      gsap.set(item, {rotateY: 0, z: 0});
    }
  });

  scrollNow = now;

  if (wrapper.scrollLeft === 0) btns.prev.disabled = true
  else if (inner.offsetWidth - wrapper.scrollLeft === wrapper.offsetWidth - padding*2) btns.next.disabled = true
  else {btns.prev.disabled = false; btns.next.disabled = false;}
  requestAnimationFrame(render);
}

render();

function nextBtn() {
  wrapper.scrollLeft += document.querySelector('.scroll-item').offsetWidth*2 - 20;
}
function prevBtn() {
  wrapper.scrollLeft -= document.querySelector('.scroll-item').offsetWidth*2 - 20;
}






fetch("https://api.disneyapi.dev/character?page=147&pageSize=50")
    .then(response => response.json())
    .then(data => {
        const characters = data.data;
        const scrollItems = document.querySelectorAll('.scroll-item'); 

        characters.forEach((character, index) => {
            if (scrollItems[index]) {
               
                const nameElement = scrollItems[index].querySelector('h2');
                if (nameElement) {
                    nameElement.textContent = character.name;
                }

                const tvShowElement = scrollItems[index].querySelector('.scroll-item-tvShow');
                if (tvShowElement && character.tvShows && character.tvShows.length > 0) {
                    tvShowElement.textContent = character.tvShows.join(', ');
                } else if (tvShowElement) {
                    tvShowElement.textContent = 'TV Show: Unknown';
                }

                const imageElement = scrollItems[index].querySelector('img');
                if (imageElement) {
                    imageElement.src = character.imageUrl || 'https://via.placeholder.com/150';
                    imageElement.alt = `${character.name} image`;
                }

                scrollItems[index].addEventListener('click', () => {
                    if (character._id) {
                        window.location.href = `details.html?characterId=${character._id}`;
                    } else {
                        alert("Character ID is missing.");
                    }
                });
            }
        });
    })

    .catch(error => console.log(error));



const API_BASE_URL = "https://api.disneyapi.dev/character?page=";
const PAGE_SIZE = 50;
let allCharacters = []; // Store all fetched characters
const searchDropdown = document.getElementById("searchCharacterName");


// Disable the dropdown until fetching is complete
searchDropdown.disabled = true;

// Fetch all characters and populate the dropdown
async function fetchAllCharacters() {
    console.log("Starting fetchAllCharacters..."); 
    let page = 1; 
    const totalPages = 150; 
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

    // Log each character name
    characters.forEach(character => console.log(character.name));
    characters.forEach(character => console.log(character._id));

    // Populate the dropdown with character names
    populateDropdown(characters);
}

function populateDropdown(characters) {
    searchDropdown.innerHTML = "<option value=\"\" hidden>Select a character</option>"; // Reset options

    characters.forEach(character => {
        const option = document.createElement("option");
        option.value = character._id;   
        option.textContent = character.name; // Display character name
        searchDropdown.appendChild(option);
    });

    // Enable the dropdown after population
    searchDropdown.disabled = false;
    console.log("Dropdown is now enabled.");
}

// Fetch and display characters with clickable search options
function populateCharacters(characters) {
    const characterList = document.getElementById('character-list');
    characterList.innerHTML = ''; // Clear existing items

    characters.forEach(character => {
        const characterItem = document.createElement('a');
        characterItem.href = `details.html?characterId=${character._id}`; // Link to details page
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

// Search functionality
const searchInput = document.getElementById('searchCharacterName');
searchInput.addEventListener('change', function () {
    const selectedCharacterId = this.value;
    if (selectedCharacterId) {
        // Redirect to details page when an option is clicked
        window.location.href = `details.html?characterId=${selectedCharacterId}`;
    }
});

// Fetch and populate search dropdown
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

// Initialize
logCharacterNames();
