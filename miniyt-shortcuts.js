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

document.onkeypress = function(e) {
    if (document.activeElement === ytSearch ||
        document.activeElement === ytFavoritesInput) {
        return; // Ignore shortcuts while search is focused.
    }
    switch(e.which || e.keyCode) {
        case "\\".charCodeAt(0): dequeueVideo(); break;
        case "n".charCodeAt(0): 
            if (ytFavoritesInput.value == "") {
                dequeueVideo(); 
            } else {
                playNextVideo();
            }
            break;
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
        case "t".charCodeAt(0): deleteCurrentFavoriteList(); break;
        case "u".charCodeAt(0): ytFavoritesInput.value = ""; ytFavoritesInput.focus(); break;
    }
    return false;
};

