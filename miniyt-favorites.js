var playingFavorites = false;
var favorites = {};
function loadFavorites() {
    if (window.localStorage['favorites'] == undefined) {
        window.localStorage['favorites'] = "{}";
    }
    let favorites = JSON.parse(window.localStorage['favorites']);
    for (let f in favorites) {
        createFavoritesList(f, favorites[f]);
    }
}
function saveFavorites() {
    window.localStorage['favorites'] = JSON.stringify(favorites);
}
function addFavoritesToList(favorites) {
    for (let f in favorites) {
        let option = document.createElement("option");
        option.innerText = option.value = f['name'];
        ytFavoritesSelect.appendChild(option);
    }
}
function addSelectedToFavorites() {
    let video = document.getElementsByClassName("yt-thumbnail")[videoSelected];
    let vid = video.getAttribute("vid");
    let title = video.getAttribute("title");
    addToCurrentFavoriteList(title, vid);
}
function addToCurrentFavoriteList(title, vid) {
    console.log('Adding to favorites.');
    let name = ytFavoritesInput.value;
    if (favorites[name] != undefined) {
        let track = { vid: vid, title: title };
        favorites[name] = favorites[name].concat(track)
        saveFavorites();
        console.log(`Added to playlist ${name}.`);
        selectFavoritesList(name);
    }
}
function createFavoritesList(name, tracks=[]) {
    console.log(`Create favorites list: ${name}.`);
    if (name in favorites) {
        console.log("Playlist already exists.");
        return;
    }
    let option = document.createElement("option");
    option.innerText = option.value = name;
    ytFavoritesList.appendChild(option);
    favorites[name] = tracks;
    saveFavorites();
}
function selectFavoritesList(name) {
    ytFavoritesInput.blur();
    console.log(`Selected playlist: ${name}.`);
    playlist = [];
    renderPlaylist();
    for (let v in favorites[name]) {
        let e = favorites[name][v];
        console.log(`Adding track: ${e["vid"]} ${e["title"]}.`);
        queueVideo(e["vid"], e["title"], true);
    }
}
function deleteCurrentFavoriteList() {
    let name = ytFavoritesInput.value;
    console.log(`Deleting list ${name}.`);
    let option = ytFavoritesList.querySelector(`option[value=${name}]`);
    if (option != undefined) {
        console.log("Found option.");
        option.parentElement.removeChild(option);
    }
    delete favorites[name];
    saveFavorites();
    let next = Object.keys(favorites)[0];
    ytFavoritesInput.value = next;
    selectFavoritesList(next);
}
function removeFavorite(entry) {
    console.log("Removing favorite.");
    let vid = entry.vid;
    let fl = favorites[ytFavoritesInput.value];
    for (let track in fl) {
        if (fl[track].vid == vid) {
            console.log('Found track to remove.');
            fl.splice(track, 1);
            saveFavorites();
            return;
        }
    }
}