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
    if (vid == "") {
        return;
    }
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
            if (ytFavoritesInput.value != "") {
                addToCurrentFavoriteList(title, vid);
            } else {
                queueVideo(vid, title);
            }
        };
        ea.setAttribute("class", "yt-video-link-added");
    };
}
function clearVideos() {
    document.querySelectorAll('a').forEach(e => e.remove());
    addedVideos = [];
}