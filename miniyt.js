"use strict";

const ytTopPanel = document.getElementById("panel");
const ytSearch = document.getElementById("search");
const ytMainView = document.getElementById("mainview");
const ytPlaylist = document.getElementById("playlist");
const ytFavoritesInput = document.getElementById("favoritesInput")
const ytFavoritesList = document.getElementById("favoritesList")

document.onkeypress = function(e) {
    if (document.activeElement === ytSearch ||
        document.activeElement === ytFavoritesInput) {
        return; // Ignore shortcuts while search is focused.
    }
    switch(e.which || e.keyCode) {
        case "\\".charCodeAt(0): dequeueVideo(); break;
        case "n".charCodeAt(0): dequeueVideo(); break;
        case "f".charCodeAt(0): toggleFullscreen(); break;
        case "/".charCodeAt(0): ytSearch.focus(); break;
        case "[".charCodeAt(0): seekToOffset(-10.0); break;
        case "]".charCodeAt(0): seekToOffset(+10.0); break;
        case "p".charCodeAt(0): togglePausePlay(); break;
        case " ".charCodeAt(0): togglePausePlay(); break;
        case "1".charCodeAt(0): seekToPercent(0); break;
        case "2".charCodeAt(0): seekToPercent(10); break;
        case "3".charCodeAt(0): seekToPercent(20); break;
        case "4".charCodeAt(0): seekToPercent(30); break;
        case "5".charCodeAt(0): seekToPercent(40); break;
        case "6".charCodeAt(0): seekToPercent(50); break;
        case "7".charCodeAt(0): seekToPercent(60); break;
        case "8".charCodeAt(0): seekToPercent(70); break;
        case "9".charCodeAt(0): seekToPercent(80); break;
        case "0".charCodeAt(0): seekToPercent(90); break;
        case "-".charCodeAt(0): decreaseVolume(); break;
        case ",".charCodeAt(0): decreaseVolume(); break;
        case "=".charCodeAt(0): increaseVolume(); break;
        case ".".charCodeAt(0): increaseVolume(); break;
        case "m".charCodeAt(0): toggleMute(); break;
        case "{".charCodeAt(0): decreasePlaybackRate(); break;
        case "}".charCodeAt(0): increasePlaybackRate(); break;
        case "r".charCodeAt(0): resetInterface(); break;
        case "c".charCodeAt(0): clearVideos(); break;
        case "v".charCodeAt(0): addRelatedVideos(player.getVideoData().video_id); break
        case "k".charCodeAt(0): selectPreviousVideo(); break;
        case "j".charCodeAt(0): selectNextVideo(); break;
        case "h".charCodeAt(0): selectFirstVideo(); break;
        case "l".charCodeAt(0): selectLastVideo(); break;
        case "?".charCodeAt(0): showHelp(); break;
        case "i".charCodeAt(0): addSelectedVideo(); break;
        case "y".charCodeAt(0): openYouTube(); break;
        case "o".charCodeAt(0): openHookTube(); break;
        case "d".charCodeAt(0): downloadPlaylist(); break;
        case "q".charCodeAt(0): increaseSaturation(); break;
        case "a".charCodeAt(0): decreaseSaturation(); break;
        case "w".charCodeAt(0): increaseBrightness(); break;
        case "s".charCodeAt(0): decreaseBrightness(); break;
        case "b".charCodeAt(0): addSelectedToFavorites(); break;
        case "t".charCodeAt(0): deleteCurrentFavoriteList(); break;
        case "u".charCodeAt(0): ytFavoritesInput.value = ""; ytFavoritesInput.focus(); break;
    }
    return false;
};

function showHelp() {
    alert(`
Keyboard Shortcuts
===============
f: Toggle fullscreen.
Space or p: Toggle play/pause.
/: Jump to search.
[]: Seek forward/back.
\\ or n: Skip current video.
0-9: Seek to video offsets.
-+ or ,.: Adjust volume.
m: Toggle mute.
{}: Increase/decrease playback speed.
r: Reset page.
c: Clear videos.
v: Add related videos.
j/k: Select next/previous search result.
h/l: Select first/last search result.
q/a: Adjust saturation.
w/s: Adjust brightness.
i: Add selection to front of queue.
d: Download playlist as M3U.
o: Open on HookTube.
y: Open on YouTube.
?: Show this help.`);
}

ytFavoritesInput.onkeypress = function(e) {
    let code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { // Enter
        e.preventDefault();
        createFavoritesList(ytFavoritesInput.value);
        selectFavoritesList(ytFavoritesInput.value);    
        this.blur();
    }
};
ytFavoritesInput.onclick = function(e) {
    this.value = "";
}
ytFavoritesInput.onchange = function(e) {
    selectFavoritesList(ytFavoritesInput.value);
}
ytSearch.onkeypress = function(e) {
    let code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { // Enter
        e.preventDefault();
        addSearchVideos(e.srcElement.value);
        e.srcElement.value = "";
        this.blur();
    }
};
ytSearch.onfocus = function(e) {
    this.value = "";
};
var videoSelected = -1;
function selectVideo(index) {
    let videos = document.getElementsByClassName("yt-thumbnail");
    if (videos.length === 0) {
        return;
    }
    if (videos[videoSelected] !== undefined) {
        videos[videoSelected].style = videos[videoSelected]._saved;
        videos[videoSelected]._saved = undefined;
    }
    if (index >= videos.length) {
        index = 0;
    }
    if (index < 0) {
        index = videos.length - 1;
    }
    videos[index]._saved = videos[index].style;
    videos[index].style.boxShadow = "0px 0px 10px 5px #FFFFFFAA";
    videos[index].style.filter = "saturate(150%) brightness(175%)";
    scrollMainView(videos[index]);

    return index;
}
function scrollMainView(e) {
    let offset = 0;
    while(e) {
        offset += e.offsetTop;
        e = e.offsetParent;
    }
    ytMainView.scrollTo(0, offset - window.innerHeight / 3);
}
function selectNextVideo() {
    videoSelected = selectVideo(videoSelected + 1);
}
function selectPreviousVideo() {
    videoSelected = selectVideo(videoSelected - 1);
}
function selectFirstVideo() {
    videoSelected = selectVideo(0);
}
function selectLastVideo() {
    videoSelected = selectVideo(-1);
}
function addSelectedVideo() {
    let video = document.getElementsByClassName("yt-thumbnail")[videoSelected];
    if (video !== undefined) {
        video.click();
    }
}
function openYouTube() {
    window.open("https://www.youtube.com/watch?v=" + player.getVideoData().video_id)
}
function openHookTube() {
    window.open("https://hooktube.com/watch?v=" + player.getVideoData().video_id)
}
function resetInterface() {
    window.location = window.location.pathname;
}
var saturation = 100;
var brightness = 100;
function increaseBrightness() {
    brightness *= 1.02;
    updateFilters();
}
function decreaseBrightness() {
    brightness /= 1.02;
    updateFilters();
}
function increaseSaturation() {
    saturation *= 1.02;
    updateFilters();
}
function decreaseSaturation() {
    saturation /= 1.02;
    updateFilters();
}
function updateFilters() {
    player.a.style.filter = `saturate(${saturation}%) brightness(${brightness}%)`;
}
////////////////////////////////////////////
// Player
////////////////////////////////////////////
var player;
function onYouTubeIframeAPIReady() {
    const config = {
        playerVars: {
            "autoplay": 1,
            "iv_load_policy": 3
        },
        videoId: getVidFromUrl(),
        events: {
            "onStateChange": onPlayerStateChange
        }
    };
    player = new YT.Player("player", config);
}
function tryPlayVideo(seek) {
    if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
        player.playVideo();
        setTimeout(function(){tryPlayVideo(seek);}, 200);
    }
    // Only seek if the time saved is more than a few seconds
    // into video. This eliminates annoying pauses in playback
    // if one queues videos quickly.
    else if (seek > 5) {
        player.seekTo(seek);
    }
}
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        dequeueVideo();
    }
}
function seekToOffset(offset) {
    let currentTime = player.getCurrentTime();
    currentTime += offset;
    player.seekTo(currentTime);
}
function seekToPercent(percent) {
    player.seekTo(player.getDuration() * percent / 100);
}
function increaseVolume() {
    player.setVolume(player.getVolume() + 5);
}
function decreaseVolume() {
    player.setVolume(player.getVolume() - 5);
}
function togglePausePlay() {
    if (player.getPlayerState() !== 1) {
        player.playVideo();
    } else {
        player.pauseVideo();
    }
}
function increasePlaybackRate() {
    let ar = player.getAvailablePlaybackRates();
    let cr = player.getPlaybackRate();
    let ix = Math.min(ar.indexOf(cr) + 1, ar.length - 1);
    player.setPlaybackRate(ar[ix]);
}
function decreasePlaybackRate() {
    let ar = player.getAvailablePlaybackRates();
    let cr = player.getPlaybackRate();
    let ix = Math.max(ar.indexOf(cr) - 1, 0);
    player.setPlaybackRate(ar[ix]);
}
var mute = false;
function toggleMute() {
    mute = !mute;
    if (mute) {
        player.mute();
    } else {
        player.unMute();
    }
}
var fullscreen = false;
function toggleFullscreen() {
    fullscreen = !fullscreen;
    if (fullscreen) {
        player.getIframe().requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
////////////////////////////////////////////
// Playlist
////////////////////////////////////////////
var playlist = [];
function renderPlaylist() {
    ytPlaylist.innerHTML = "";
    for (let i = playlist.length - 1; i >= 0; i--) {
        let p = document.createElement("p");
        p.onclick = function(e) {
            console.log('Remove track '+i);
            if (playlist[i].isFavorite == true) {
                removeFavorite(playlist[i]);
                if (playlist.length - 1 == i) {
                    dequeueVideo();
                }
                playlist.splice(i, 1);
                renderPlaylist();
                return;
            }
            if (playlist.length - 1 == i) {
                dequeueVideo();
            } else {
                playlist.splice(i, 1);
                renderPlaylist();
            }                
        };
        if (playlist[i].isFavorite == true) {
            p.style.color = "red";
        }
        p.setAttribute("class", "yt-playlistentry");
        let prefix = "";
        if (i == playlist.length - 1) {
            prefix = "&#x25b6; ";
            p.setAttribute("class", "yt-playing");
        }
        ytPlaylist.appendChild(p);
        p.innerHTML = prefix + playlist[i]["title"];
    }
}
function queueVideo(vid, title, isFavorite=false) {
    if (playlist.length > 0) {
        playlist[playlist.length - 1]["time"] = player.getCurrentTime();
    }
    playlist.push({
        vid: vid,
        title: title,
        time: 0,
        isFavorite: isFavorite
    });
    renderPlaylist();
    window.location.hash = "#" + vid;
    document.title = title;

    if (player !== undefined) {
        player.loadVideoById(vid);
        // Ignore any progress that might have been saved by YouTube.
        player.seekTo(0);
        player.playVideo();
    }
}
function dequeueVideo() {
    if (playlist.length <= 1) {
        return;
    }
    playlist.pop();
    renderPlaylist();
    let entry = playlist[playlist.length - 1];
    let vid = entry["vid"];
    window.location.hash = "#" + vid;
    player.loadVideoById(vid);
    tryPlayVideo(playlist[playlist.length - 1]["time"]);
    document.title = entry["title"];
}
function getVidFromUrl() {
    return window.location.hash.substring(1);
}
function downloadPlaylist() {
    let pl = "#EXTM3U\n";
    for (let i = playlist.length - 1; i >= 0; i--) {
        pl += `#EXTINF:0,${playlist[i]["title"]}\n`;
        pl += `https://www.youtube.com/watch?v=${playlist[i]["vid"]}\n`;
    }
    let a = document.createElement('a');
    a.href = 'data:application/octet-stream;base64,' + btoa(unescape(encodeURIComponent(pl)));
    a.download = `MiniYT_${new Date().toJSON()}.m3u`;
    a.click();
}
////////////////////////////////////////////
// Video loading and query.
////////////////////////////////////////////
var addedVideos = [];
var apiKey;
var videosPerRelated;
var videosPerSearch;

function GetJSON(url, callback) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "json";
    request.onload = function() {
        callback(request.response);
    };
    request.send();
}
function addRelatedVideos(vid) {
    let url = "https://www.googleapis.com/youtube/v3/search?" +
              "maxResults=50&part=snippet&type=video" +
              "&key=" + apiKey +
              "&relatedToVideoId=" + vid;
    addVideos(url, videosPerRelated, false);
}
function addSearchVideos(query) {
    if (query.trim() === "") {
        return;
    }
    let url = "https://www.googleapis.com/youtube/v3/search?" +
              "maxResults=50&part=snippet&type=video" +
              "&key=" + apiKey +
              "&q=" + encodeURIComponent(query);
    addVideos(url, videosPerSearch, true);
}
function addVideos(url, max, prepend) {
    let count = 0;
    let callback = function(response) {
        if (response.items == undefined) {
            return;
        }
        for (let i = 0; i < response.items.length && count < max; i++) {
            let item = response.items[i];
            let vid = item["id"]["videoId"];
            let title = item["snippet"]["title"];
            let thumb = item["snippet"]["thumbnails"]["high"]["url"];
            addVideoToView(ytMainView, vid, title, thumb, prepend);
            count++;
        }
        if (count >= max) {
            return;
        }
        let token = response["nextPageToken"];
        if (token !== undefined) {
            GetJSON(url + "&pageToken=" + token, callback);
        }
    }
    GetJSON(url, callback);
}
function addVideoToView(view, vid, title, thumb, prepend) {
    if (addedVideos[vid] !== undefined) {
        return; // Ignore existing video thumbnail.
    }
    addedVideos[vid] = true;

    let iid = "IMG_" + vid;
    let img = document.createElement("img");
    img.setAttribute("src", thumb);
    img.setAttribute("class", "yt-thumbnail");
    img.setAttribute("id", iid);
    img.setAttribute("vid", vid);
    img.setAttribute("title", title);

    let aid = "A_" + vid;
    let a = document.createElement("a");
    a.setAttribute("class", "yt-video-link");
    a.appendChild(img);
    a.setAttribute("id", aid);
    a.innerHTML += title;

    if (prepend) {
        view.prepend(a);
    } else {
        view.appendChild(a);
    }

    let ei = document.getElementById(iid);
    let ea = document.getElementById(aid);

    ei.onclick = function() {
        if (ytFavoritesInput.value != "") {
            addToCurrentFavoriteList(title, vid);
        } else {
            queueVideo(vid, title);
        }
        addRelatedVideos(vid);
        ei.onclick = function() {
            queueVideo(vid, title);
        };
        ea.setAttribute("class", "yt-video-link-added");
    };
}
function clearVideos() {
    document.querySelectorAll('a').forEach(e => e.remove());
    addedVideos = [];
}
////////////////////////////////////////////
// Favorites.
////////////////////////////////////////////
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
////////////////////////////////////////////
// Setup.
////////////////////////////////////////////
function configure() {
    apiKey = "AIzaSyDaPnpShE8nxyGs-QjX55r5qREcQhub-j8";
    videosPerSearch = 300;
    videosPerRelated = 200;
    document.title = "MiniYT 1.1";
}
document.body.onload = function() {
    configure();
    addRelatedVideos(getVidFromUrl());
    loadFavorites();
}
