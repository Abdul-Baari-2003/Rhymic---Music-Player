const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    volumeControl = document.getElementsByClassName('volume-control'),
    volumeSlider = document.getElementById('volume'),
    volumeIcon = document.getElementById('volume-icon'),
    background = document.getElementById('bg-img');
    

const music = new Audio();

const songs = [];
// Add loading spinner logic
const loader = document.getElementById('loader');

const songListContainer = document.getElementById('song-list');

function showLoader() {
    loader.style.display = 'block';
}

function hideLoader() {
    loader.style.display = 'none';
}
// Fetch songs from the Python server
async function fetchSongs() {
    showLoader(); // Show loading spinner
    try {
        const response = await fetch('http://127.0.0.1:5000/api/songs');
        const data = await response.json();
        console.log('Fetched data:', data);
        songs.push(...data);
        loadMusic(songs[musicIndex]);
        displaySongList(); // Add this line to display the song list
    } catch (error) {
        console.error('Error fetching songs:', error);
    } finally {
        hideLoader(); // Hide loading spinner
    }
}

// Call the function to fetch songs
fetchSongs();

function displaySongList() {
    songListContainer.innerHTML = ''; // Clear previous content

    songs.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = 
            `<div class="song-item">
                <img src="${song.cover}" alt="${song.displayName}" class="song-cover">
                <div class="song-info">
                    <p class="song-name" style="font-weight:bold; font-size:14px;">${song.displayName}</p>
                    <p class="song-artist">${song.artist}</p>
                </div>
                <button class="play-button" onclick="playSong(${index})"><i class="bi bi-play-fill"></i></button>
            </div>`
        ;
        songListContainer.appendChild(listItem);
    });
}

// Function to play a specific song from the list
function playSong(index) {
    musicIndex = index;
    loadMusic(songs[musicIndex]);
    playMusic();
}



let musicIndex = 0;
let isPlaying = false;
let shuffle = false; // Track shuffle state
let repeat = false;


function togglePlay() {
    if (music.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

function toggleRepeat() {
    repeat = !repeat;
    updateRepeatIcon();

    if (repeat) {
        // Add the event listener to loop the current song
        music.addEventListener('ended', repeatCurrentSong);
    } else {
        // Remove the event listener if repeat is disabled
        music.removeEventListener('ended', repeatCurrentSong);
    }
    
    // If repeat is enabled, reset the song to the beginning and play
    if (repeat) {
        music.addEventListener('ended', repeatCurrentSong);
        repeatCurrentSong();
    }
}

function repeatCurrentSong() {
    // If repeat is enabled, reset the song to the beginning and play
    if (repeat) {
        music.currentTime = 0;
        playMusic();
    } else {
        // If repeat is not enabled, proceed to the next song
        changeMusic(1);
    }
}

async function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');

    try {
        await music.play();
    } catch (error) {
        console.error('Error playing music:', error);
    }
}

async function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');

    try {
        await music.pause();
    } catch (error) {
        console.error('Error pausing music:', error);
    }
}

function loadMusic(song) {
    if (song) {
        music.src = song.path;
        title.textContent = song.displayName;
        artist.textContent = song.artist;
        image.src = song.cover;
        updateMetadata(); // Call the new function to update metadata
    }
}


function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;

    // Preload the next song
    const nextSong = new Audio();
    nextSong.src = songs[(musicIndex + 1) % songs.length].path;

    loadMusic(songs[musicIndex]);
    // If the music was playing before changing the song, play the next song
    if (isPlaying) {
        // Pause for 1 second before playing the next song
    setTimeout(() => {
        playMusic();
    }, 1000);
    }
    // If it was paused, keep the next song paused
    else {
        pauseMusic();
    }
    
}



function toggleShuffle() {
    shuffle = !shuffle;
    updateShuffleIcon();
    // If shuffle is enabled, shuffle the songs array
    if (shuffle) {
        shuffleArray(songs);
    }
}




volumeIcon.addEventListener('click', toggleVolumeSlider);

function toggleVolumeSlider() {
    const isVisible = volumeSlider.style.display !== 'inline-block';

    volumeSlider.style.display = isVisible ? 'inline-block' : 'none';

    // If the volume slider is visible, focus on it
    if (!isVisible) {
        volumeSlider.focus();
    }
}


function setVolume() {
    const volume = volumeSlider.value;
    music.volume = volume;

    // Update volume icon based on volume level
    updateVolumeIcon(volume);
}

function updateShuffleIcon() {
    const shuffleIcon = document.getElementById('shuffle');
    shuffleIcon.classList.toggle('active', shuffle);
}

function updateRepeatIcon() {
    const repeatIcon = document.getElementById('repeat');
    repeatIcon.classList.toggle('active', repeat);

    // Update the title to indicate the repeat state
    repeatIcon.setAttribute('title', repeat ? 'Repeat (On)' : 'Repeat (Off)');
}

function updateVolumeIcon(volume) {
    const volumeIcon = document.getElementById('volume-icon');

    if (volume == 0) {
        volumeIcon.classList.replace('fa-volume-up', 'fa-volume-mute');
    } else if (volume > 0 && volume <= 0.5) {
        volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-down');
    } else {
        // Updated this part to handle the transition back to the appropriate icon
        volumeIcon.classList.replace('fa-volume-mute', 'fa-volume-up');
        volumeIcon.classList.replace('fa-volume-down', 'fa-volume-up');
    }
}


// Add this function to shuffle the array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function updateProgressBar() {
    const { duration, currentTime } = music;

    // Check if duration is a valid number before updating the progress bar
    if (!isNaN(duration) && isFinite(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
        durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
        currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
    }
}

// Updated setProgressBar function to prevent errors on touch devices
function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.type === 'touchend' ? e.changedTouches[0].clientX - playerProgress.getBoundingClientRect().left : e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

// Add accessibility features
music.addEventListener('keydown', (e) => {
    if (e.key === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeMusic(-1);
    } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeMusic(1);
    }
});

// Add dynamic title and metadata
function updateMetadata() {
    document.title = `${songs[musicIndex].displayName} - ${songs[musicIndex].artist} | Rhymic`;
    // You can add more metadata updates here if needed
}


function searchSongs() {
    const searchInput = document.getElementById('search');
    const query = searchInput.value.toLowerCase();

    // Check if the search box is empty
    if (query.trim() === '') {
        // Display nothing when search box is empty
        clearSearchResults();
        return;
    }

    const searchResults = songs.filter(song => {
        return (
            song.displayName.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
        );
    });

    if (searchResults.length > 0) {
        // Update the UI with search results
        displaySearchResults(searchResults);
    } else {
        alert('No matching songs found.');
    }
}

// Function to clear search results
function clearSearchResults() {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';
}

// Function to handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Check if the pressed key is Enter
    if (e.key === 'Enter') {
        // Call the searchSongs function when Enter key is pressed
        searchSongs();
    }
}

// Add event listener for the 'keyup' event on the search input
document.getElementById('search').addEventListener('keyup', handleKeyboardShortcuts);

function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';

    results.forEach(song => {
        const songItem = document.createElement('div');
        songItem.className = 'search-result-item';
        songItem.innerHTML = `
            <span class="song-info">${song.displayName} - ${song.artist}</span>
            <span class="play-icon">&#9654;</span>`
        ;
        songItem.addEventListener('click', () => playSearchedSong(song));
        searchResultsContainer.appendChild(songItem);
    });
}


function playSearchedSong(song) {
    // Implement the logic to play the searched song
    musicIndex = songs.findIndex(s => s === song);
    loadMusic(song);
    playMusic();

    // Clear the search box and hide search results
    clearSearch();
}
// Function to clear the search box and hide search results
function clearSearch() {
    const searchInput = document.getElementById('search');
    const searchResultsContainer = document.getElementById('search-results');

    searchInput.value = '';
    searchResultsContainer.innerHTML = '';
}

document.getElementById('shuffle').addEventListener('click', toggleShuffle);
document.getElementById('repeat').addEventListener('click', toggleRepeat);
document.getElementById('volume').addEventListener('input', setVolume);
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

loadMusic(songs[musicIndex]);
