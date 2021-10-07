const urlInput = document.getElementById("url");
const skipTimeInput = document.getElementById("skip-time");
const playerVideo = document.getElementById("player");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");
const skipButton = document.getElementById("skipButton");
const animeSelect = document.getElementById("anime");
let timeToSkip = document.getElementById("skip-time");
let fullscreenContainer = document.getElementById("fullscren-div");
let episodesSelect = document.getElementById("ep");
let animesSelect = document.getElementById("anime");

const animes = [
  {
    anime: "Naruto Shippuden",
    episodes: Array.from(Array(500).keys()),
    url: "https://pitou.goyabu.com/naruto-shippuden/01.mp4",
  },
  {
    anime: "One Piece",
    episodes: Array.from(Array(1000).keys()),
    url: "https://pitou.goyabu.com/naruto-shippuden/02.mp4",
  },
];

const handleEnterKey = ({ keyCode, target }) => {
  if (keyCode === 13) {
    return setUrlInLocalStorage(target.value);
  }

  if (keyCode === 40 && document.fullscreenElement) {
    return skipIntro();
  }
};

const setUrlInLocalStorage = (url) => {
  localStorage.setItem("url", url);
};

const getUrlInLocalStorage = (_) => {
  return localStorage.getItem("url");
};

const getEpisode = (_) => {
  const url = getUrlInLocalStorage();

  if (url) {
    const urlArray = url.split("/");
    const episode = urlArray[urlArray.length - 1].split(".")[0];
    const episodeNumber = eval(episode);

    if (episodeNumber) {
      return episodeNumber;
    }

    return false;
  }

  return false;
};

const nextEpisode = (_) => {
  let currentEpisode = getEpisode();

  if (currentEpisode) {
    currentEpisode++;
    const newUrl = concatEpisode(currentEpisode);
    setEpisodeInPlayer(newUrl);
    setUrlInLocalStorage(newUrl);
  }
};

const previousEpisode = (_) => {
  let currentEpisode = getEpisode();

  if (currentEpisode) {
    currentEpisode--;
    const newUrl = concatEpisode(currentEpisode);
    setEpisodeInPlayer(newUrl);
    setUrlInLocalStorage(newUrl);
  }
};

const concatEpisode = (episodeNumber) => {
  const url = getUrlInLocalStorage();
  let urlArray = url.split("/");
  let lastPositionArray = urlArray[urlArray.length - 1];
  let extension = lastPositionArray.split(".")[1];

  lastPositionArray = String(episodeNumber) + "." + extension;
  urlArray[urlArray.length - 1] = lastPositionArray;

  return urlArray.join("/");
};

const setEpisodeInPlayer = (url) => {
  urlInput.value = url;
  playerVideo.src = url;
};

const skipIntro = (_) => {
  const time = timeToSkip.value;

  if (time) {
    playerVideo.currentTime += Number(time);
    playerVideo.onplay = true;
  }
};

const createOptions = (_) => {
  animes.forEach((anime, index) => {
    const optAnime = document.createElement("option");
    optAnime.innerText = anime.anime;
    optAnime.value = anime.anime;
    animesSelect.appendChild(optAnime);
  });

  animes[0].episodes.forEach((ep, index) => {
    const opt = document.createElement("option");
    opt.innerText = ++index;
    episodesSelect.appendChild(opt);
  });
};

const onAnimeChange = () => {
  const index = animes.findIndex((i) => i.anime === animeSelect.value);

  animes[index].episodes.forEach((ep, index) => {
    const opt = document.createElement("option");
    opt.innerText = ++index;
    episodesSelect.appendChild(opt);
  });
};

const onEpChange = () => {
  const newUrl = concatEpisode(Number(episodesSelect.value));
  setEpisodeInPlayer(newUrl);
  setUrlInLocalStorage(newUrl);
  playerVideo.onplay = true;
};

const onInit = (_) => {
  const url = getUrlInLocalStorage();

  if (url) {
    setEpisodeInPlayer(url);
    playerVideo.currentTime = Number(localStorage.getItem("time"));
    playerVideo.onplay = true;
  }

  createOptions();
  urlInput.addEventListener("keyup", handleEnterKey);
  document.body.addEventListener("keyup", handleEnterKey);
  nextButton.addEventListener("click", nextEpisode);
  previousButton.addEventListener("click", previousEpisode);
  skipButton.addEventListener("click", skipIntro);
  animeSelect.addEventListener("change", onAnimeChange);
  episodesSelect.addEventListener("change", onEpChange);
  renderButton.addEventListener("click", renderEpisode);

  setInterval(() => {
    localStorage.setItem("time", playerVideo.currentTime);
  }, 60000);
};

onInit();
