import { H as Hls } from "./hls.js";

export function initMoviePlayer(options) {
  var wrapper = document.querySelector(options.root);

  if (!wrapper) {
    return;
  }

  var video = wrapper.querySelector("video");
  var playButton = wrapper.querySelector("[data-play]");
  var source = options.source;
  var hls = null;
  var ready = false;

  if (!video || !playButton || !source) {
    return;
  }

  function prepare() {
    if (ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    ready = true;
  }

  function play() {
    prepare();
    wrapper.classList.add("is-playing");
    playButton.hidden = true;

    var promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        playButton.hidden = false;
        wrapper.classList.remove("is-playing");
      });
    }
  }

  playButton.addEventListener("click", play);

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener("play", function () {
    wrapper.classList.add("is-playing");
    playButton.hidden = true;
  });

  video.addEventListener("pause", function () {
    if (!video.ended) {
      playButton.hidden = false;
      wrapper.classList.remove("is-playing");
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
