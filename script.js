let currentSong = new Audio();
let songs = [];
let currentSongIndex = 0;

function convertToMinuteSecond(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function fetchSongsFromiTunes(query) {
    try {
        let response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=50`);
        let data = await response.json();
        
        songs = data.results.filter(track => track.previewUrl).map(track => ({
            trackName: track.trackName,
            artistName: track.artistName,
            previewUrl: track.previewUrl,
            coverArt: track.artworkUrl100 || 'img/music.svg'
        }));
        
        renderSongList();
        if (songs.length > 0) {
            playMusic(0, true); // load first song but pause
        }
    } catch (error) {
        console.error("Error fetching from iTunes:", error);
    }
}

function renderSongList() {
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";
    
    if (songs.length === 0) {
        songUL.innerHTML = `<li style="justify-content:center; color: var(--text-secondary); padding: 20px;">No songs found. Try another search!</li>`;
        return;
    }

    songs.forEach((song, index) => {
        songUL.innerHTML += `<li>
            <img class="icon" src="${song.coverArt}" alt="cover" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
            <div class="info">
                <div>${song.trackName}</div>
                <div>${song.artistName}</div>
            </div>
            <div class="playNow">
                <img class="icon" src="img/play.svg" alt="play">
            </div>
        </li>`;
    });

    // Attach click listeners
    Array.from(document.querySelectorAll(".songlist li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playMusic(index);
        });
    });
}

const playMusic = (index, pause = false) => {
    if (index < 0 || index >= songs.length) return;
    currentSongIndex = index;
    let song = songs[index];
    
    currentSong.src = song.previewUrl;
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "img/pause.svg";
    }

    // Update UI
    document.querySelector(".songInfo").innerHTML = `${song.trackName} <br><span style="font-size:12px;color:var(--text-secondary)">${song.artistName}</span>`;
    document.querySelector("#playerCover").src = song.coverArt;
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
}

const bollywoodGenres = [
    { query: "arijit singh", title: "Arijit Singh", desc: "Soulful voice of Bollywood", cover: "https://picsum.photos/seed/arijit/300/300" },
    { query: "bollywood hits", title: "Bollywood Hits", desc: "Latest trending Hindi songs", cover: "https://picsum.photos/seed/hits/300/300" },
    { query: "ar rahman", title: "A.R. Rahman", desc: "The Mozart of Madras", cover: "https://picsum.photos/seed/arrahman/300/300" },
    { query: "punjabi pop", title: "Punjabi Pop", desc: "High energy party tracks", cover: "https://picsum.photos/seed/punjabi/300/300" },
    { query: "lata mangeshkar", title: "Retro Classics", desc: "Golden era of Bollywood", cover: "https://picsum.photos/seed/retro/300/300" },
    { query: "shreya ghoshal", title: "Shreya Ghoshal", desc: "Melodious Queen", cover: "https://picsum.photos/seed/shreya/300/300" },
    { query: "udit narayan", title: "Udit Narayan", desc: "90s King of Melody", cover: "https://picsum.photos/seed/udit/300/300" },
    { query: "badshah pop", title: "Badshah Hits", desc: "Rap & Party anthems", cover: "https://picsum.photos/seed/badshah/300/300" },
    { query: "neha kakkar", title: "Neha Kakkar", desc: "Pop and Dance tracks", cover: "https://picsum.photos/seed/neha/300/300" },
    { query: "sufi bollywood", title: "Sufi Nights", desc: "Soulful Bollywood Sufi", cover: "https://picsum.photos/seed/sufi/300/300" },
    { query: "kumar sanu", title: "Kumar Sanu", desc: "Vintage 90s Romance", cover: "https://picsum.photos/seed/sanu/300/300" },
    { query: "bollywood unplugged", title: "Unplugged", desc: "Acoustic desi vibes", cover: "https://picsum.photos/seed/unplugged/300/300" }
];

const discoverGenres = [
    { query: "desi hip hop", title: "Desi Hip Hop", desc: "Underground Indian rap", cover: "https://picsum.photos/seed/hiphop/300/300" },
    { query: "bhangra hits", title: "Bhangra Beats", desc: "Dhol and dance mix", cover: "https://picsum.photos/seed/bhangra/300/300" },
    { query: "indian classical", title: "Indian Classical", desc: "Traditional Ragas", cover: "https://picsum.photos/seed/classical/300/300" },
    { query: "bollywood remix", title: "Bollywood Remix", desc: "DJ Mixes and mashups", cover: "https://picsum.photos/seed/remix/300/300" },
    { query: "south indian hits", title: "South Indian Hits", desc: "Tollywood & Kollywood", cover: "https://picsum.photos/seed/south/300/300" },
    { query: "gazals", title: "Ghazal Evenings", desc: "Poetry and music", cover: "https://picsum.photos/seed/ghazal/300/300" }
];

async function loadFeaturedSets(genresArray) {
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    genresArray.forEach((genre) => {
        cardContainer.innerHTML += `
        <div data-query="${genre.query}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img src="${genre.cover}" alt="">
            <h2>${genre.title}</h2>
            <p>${genre.desc}</p>
        </div>`;
    });

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let query = item.currentTarget.dataset.query;
            await fetchSongsFromiTunes(query);
            // Open sidebar to show playlist on mobile
            if (window.innerWidth <= 1000) {
                document.querySelector(".left").style.left = "0";
            }
        })
    })
}

function showWelcomeModal(user) {
    const modal = document.getElementById("welcomeModal");
    const modalName = document.getElementById("modalUserName");
    if (modal && user) {
        modalName.innerHTML = `Welcome back, ${user.name}!`;
        modal.classList.add("show");
    }
}

function closeModal() {
    const modal = document.getElementById("welcomeModal");
    if (modal) {
        modal.classList.remove("show");
        // Ensure UI is updated if not already
        updateAuthUI();
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function updateAuthUI() {
    const authButtons = document.getElementById("authButtons");
    const user = Auth.getCurrentUser();

    if (user) {
        authButtons.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <span class="user-name">${user.name.split(' ')[0]}</span>
                <button class="logoutbtn" onclick="Auth.logout()">Log out</button>
            </div>
            <div class="hamburgerContainer">
                <img class="icon hamburger" src="img/hamburger.svg" alt="">
            </div>
        `;
    }
}

async function main() {
    updateAuthUI();
    
    // Check for login success flag
    if (sessionStorage.getItem('login_success')) {
        const user = Auth.getCurrentUser();
        if (user) {
            updateAuthUI();
            showWelcomeModal(user);
        }
        sessionStorage.removeItem('login_success');
    }

    await loadFeaturedSets(bollywoodGenres);
    // Load a default playlist
    await fetchSongsFromiTunes("bollywood hits");

    let play = document.getElementById("play");

    play.addEventListener("click", () => {
        if (!currentSong.src) return;
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".songTime").innerHTML = `${convertToMinuteSecond(currentSong.currentTime)}/${convertToMinuteSecond(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        }
        // Auto play next song when current finishes
        if (currentSong.currentTime === currentSong.duration) {
            if (currentSongIndex < songs.length - 1) playMusic(currentSongIndex + 1);
        }
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    document.querySelector(".hamburgerContainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    
    document.querySelector(".close-sidebar").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    document.getElementById("previous").addEventListener("click", () => {
        if (currentSongIndex > 0) playMusic(currentSongIndex - 1);
    })

    document.getElementById("next").addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) playMusic(currentSongIndex + 1);
    })

    document.querySelector(".vol-slider").addEventListener("input", (e) => {
        currentSong.volume = e.target.value;
        let mute = document.querySelector(".volume img");
        if (e.target.value == 0) mute.src = "img/mute.svg";
        else mute.src = "img/volume.svg";
    });

    // Handle search input enter key
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && searchInput.value.trim() !== "") {
            fetchSongsFromiTunes(searchInput.value.trim());
            // Clear input and collapse
            searchInput.value = "";
            document.getElementById("searchItem").classList.remove("expanded");
            
            if (window.innerWidth <= 1000) {
                document.querySelector(".left").style.left = "0";
            }
        }
    });

    // Spacebar to play/pause
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && e.target.tagName !== "INPUT") {
            e.preventDefault();
            play.click();
        }
    });

    // Nav Links
    const navHome = document.getElementById("navHome");
    const navDiscover = document.getElementById("navDiscover");

    navHome.addEventListener("click", () => {
        navHome.classList.add("active");
        navDiscover.classList.remove("active");
        document.querySelector(".spotifyPlaylists h2").innerHTML = "Bollywood Sets";
        loadFeaturedSets(bollywoodGenres);
        document.querySelector(".center-content").scrollTo(0,0);
    });

    navDiscover.addEventListener("click", () => {
        navDiscover.classList.add("active");
        navHome.classList.remove("active");
        document.querySelector(".spotifyPlaylists h2").innerHTML = "Discover New Sets";
        loadFeaturedSets(discoverGenres);
        document.querySelector(".center-content").scrollTo(0,0);
        
        // Auto-fetch the first discover playlist into the library
        fetchSongsFromiTunes(discoverGenres[0].query);
    });
}

// Search UI expanding
const searchItem = document.getElementById("searchItem");
const searchInput = document.getElementById("searchInput");

// Initialize when everything is loaded
document.addEventListener("DOMContentLoaded", () => {
    main();

    // Re-initialize search item listeners
    const searchItem = document.getElementById("searchItem");
    const searchInput = document.getElementById("searchInput");
    
    if (searchItem && searchInput) {
        searchItem.addEventListener("click", () => {
            searchItem.classList.add("expanded");
            searchInput.focus();
        });

        document.addEventListener("click", (e) => {
            if (!searchItem.contains(e.target)) {
                searchItem.classList.remove("expanded");
                if (!searchInput.value) {
                    searchInput.blur();
                }
            }
        });
    }
});
