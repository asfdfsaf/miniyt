var playingFavorites = false;
var favorites = {};
function loadFavorites() {
    if (window.localStorage['favorites'] == undefined) {
        window.localStorage['favorites'] = "{}";
    }
    favorites = JSON.parse(window.localStorage['favorites']);
    for (let f in favorites) {
        let option = document.createElement("option");
        option.innerText = option.value = f;
        ytFavoritesList.appendChild(option);
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
    let name = ytFavoritesInput.value;
    if (favorites[name] != undefined) {
        let track = { vid: vid, title: title };
        favorites[name] = favorites[name].concat(track)
        saveFavorites();
        selectFavoritesList(name);
    }
}
function createFavoritesList(name) {
    if (name in favorites) {
        return;
    }
    let option = document.createElement("option");
    option.innerText = option.value = name;
    ytFavoritesList.appendChild(option);
    favorites[name] = [];
    saveFavorites();
}
function selectFavoritesList(name) {
    ytFavoritesInput.blur();
    playlist = [];
    for (let v in favorites[name]) {
        let e = favorites[name][v];
        playlist.push({
            vid: e.vid,
            title: e.title,
            time: 0,
            isFavorite: true
        });
    }
    playIndex = playlist.length;
    playNextVideo();
}
function deleteCurrentFavoriteList() {
    let name = ytFavoritesInput.value;
    if (name == "") {
        return;
    }
    let option = ytFavoritesList.querySelector(`option[value="${name}"]`);
    if (option != undefined) {
        option.parentElement.removeChild(option);
    }
    delete favorites[name];
    saveFavorites();
    
    let next = Object.keys(favorites)[0];
    ytFavoritesInput.value = next;
    if (next != "" && next != undefined) {
        selectFavoritesList(next);
    } else {
        ytFavoritesInput.value = "";
        playlist = [];
        renderPlaylist();
    }
}
function removeFavorite(entry) {
    let vid = entry.vid;
    let fl = favorites[ytFavoritesInput.value];
    for (let track in fl) {
        if (fl[track].vid == vid) {
            fl.splice(track, 1);
            saveFavorites();
            return;
        }
    }
}
function sortFavorites() {
    let name = ytFavoritesInput.value;
    if (name == "") {
        return;
    }
    sorted = favorites[name].sort((a,b) => -a.title.localeCompare(b.title))
    favorites[name] = sorted;
    selectFavoritesList(name);
    saveFavorites();
    playIndex = playlist.length - 1;
}