var playlist = [];
var playIndex = 0;

function renderPlaylist() {
    ytPlaylist.innerHTML = "";
    for (let i = playlist.length - 1; i >= 0; i--) {
        let p = document.createElement("p");
        p.onclick = function(e) {
            if (e.metaKey) {
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
            } else {
                playIndex = i;
                let vid = playlist[i].vid;
                player.loadVideoById(vid);
                player.playVideo();        
                renderPlaylist();
            }
        };
        p.setAttribute("class", "yt-playlistentry");
        let prefix = "";
        if (i == playIndex) {
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
    
    window.location.hash = "#" + vid;
    document.title = title;
    playIndex = playlist.length - 1;
    renderPlaylist();

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
    playIndex = playlist.length - 1;
    document.title = entry["title"];
}
function playNextVideo() {
    console.log('Playing next video.')
    playIndex--;
    if (playIndex < 0) {
        playIndex = playlist.length - 1;
    }
    let vid = playlist[playIndex].vid;
    player.loadVideoById(vid);
    renderPlaylist();
    tryPlayVideo(playlist[playIndex].time);
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