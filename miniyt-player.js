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
        if (ytFavoritesInput.value == "") {
            dequeueVideo();
        } else {
            playNextVideo();
        }
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