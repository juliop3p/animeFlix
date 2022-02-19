const player = document.querySelector(".player");
const selectEp = document.getElementById("eps");
const animeName = document.querySelector(".anime-name");
const searchParams = new URLSearchParams(window.location.search);
const controls = document.querySelector(".controls");
const percentage = document.querySelector(".percentage");
let isPlaying = true;
let isSelectingEp = false;
let mousePosition;

let id;
let index;
let anime;
let url;
let currentEp;
let animes;
let timer;

const urlBuilder = (anime) => {
  const { url, videoType, state } = anime;

  return `${url}${sanitazeEp(state.currentEp)}.${videoType}`;
};

function prettyTime(t) {
  let minutes = Math.floor(t / 60);
  if (minutes < 10) minutes = "0" + minutes;
  let seconds = Math.floor(t % 60);
  if (seconds < 10) seconds = "0" + seconds;
  return `${minutes}:${seconds}`;
}

const sanitazeEp = (ep) => {
  let sanatizedEp;
  if (typeof ep === "number") {
    sanatizedEp = ep < 10 ? `0${ep}` : String(ep);
  } else if (typeof ep === "string") {
    sanatizedEp = ep.length === 1 ? `0${ep}` : ep;
  }

  return sanatizedEp;
};

const validateQueryParam = () => {
  if (searchParams.has("id")) {
    return true;
  } else {
    document.location.href = "/";
  }
};

const setAnime = () => {
  url = urlBuilder(anime);
  currentEp = anime.state.currentEp;

  player.src = url;
  player.currentTime = anime.state.currentTime;
};

const setName = () => {
  animeName.innerHTML = `${anime.state.currentEp} "${anime.name}"`;
};

const populateSelect = () => {
  for (i = 0; i <= 1100; i++) {
    const opt = document.createElement("option");
    const ep = sanitazeEp(i);
    opt.innerHTML = ep;

    selectEp.appendChild(opt);
  }
};

const updateSelect = () => {
  const options = selectEp.querySelectorAll("option");

  options.forEach((opt) => {
    if (opt.innerText === currentEp) {
      opt.selected = true;
    }
  });
};

const onEpChange = (ep) => {
  anime.state.currentEp = ep;
  setAnime();
  setName();
  updateSelect();
  animes[index] = anime;
  saveDataInLocalStorage();
  updateAnimeStateOnServer();
};

const onSelectChange = () => {
  onEpChange(selectEp.value);
};

const onNextOrPrevEp = (action) => {
  anime.state.currentTime = 00;

  if (action === "next") {
    let ep = Number(anime.state.currentEp);
    ep++;
    onEpChange(sanitazeEp(ep));
  } else {
    let ep = Number(anime.state.currentEp);
    ep--;
    onEpChange(sanitazeEp(ep));
  }
};

const saveCurrentStatus = () => {
  console.log("SAVING CURRENT VIDEO TIME");
  anime.state.currentTime = player.currentTime;
  animes[index] = anime;
  saveDataInLocalStorage();
};

const goBack = () => {
  animes[index] = anime;
  updateAnimeStateOnServer();
  saveCurrentStatus();
  document.location.href = "/";
};

player.addEventListener("ended", () => {
  onNextOrPrevEp("next");
});

const getDataFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("animes"));
};

const saveDataInLocalStorage = () => {
  localStorage.setItem("animes", JSON.stringify(animes));
  localStorage.setItem("lastUpdate", new Date());
};

const updateAnimeStateOnServer = () => {
  const user = localStorage.getItem("user");

  if (typeof user === "string" && user.length > 2 && user.length < 10) {
    const body = {
      userName: user,
      state: anime.state,
    };

    fetch(`https://apianimes.herokuapp.com/api/State`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => {
      if (res.status === 200) {
        return console.info("[INFO] - SESSION SAVED");
      }

      console.error("[INFO] - COULDN'T SAVE SESSION");
    });
  } else {
    localStorage.removeItem("user");
  }
};

const checkForUpdates = () => {
  const lastUpdateLocalStorage = localStorage.getItem("lastUpdate");

  if (lastUpdateLocalStorage === "" || lastUpdateLocalStorage === null) return;

  const lastUpdate = new Date(lastUpdateLocalStorage);
  const currentMoment = new Date();
  const lastUpdatePlusOneHour = lastUpdate.setHours(lastUpdate.getHours() + 1);

  if (lastUpdatePlusOneHour < currentMoment) {
    localStorage.removeItem("lastUpdate");
    document.location.href = "/";
  }
};

const showAndHideControls = () => {
  controls.style.display = "grid";

  clearInterval(timer);
  timer = setTimeout(function () {
    if (!isSelectingEp) controls.style.display = "none";
  }, 2000);
};

const showControls = () => {
  isSelectingEp = !isSelectingEp;
  controls.style.display = "grid";
};

const playOrStopVideo = () => {
  if (isPlaying) {
    document.querySelector(".fa-play").style.display = "block";
    document.querySelector(".fa-stop").style.display = "none";
    isPlaying = false;
    player.pause();
  } else {
    document.querySelector(".fa-play").style.display = "none";
    document.querySelector(".fa-stop").style.display = "block";
    isPlaying = true;
    player.play();
  }
};

const changePlayerTime = () => {
  const newTime = percentage.value;
  player.currentTime = (newTime * player.duration) / 100;
  console.log((newTime * player.duration) / 100);
};

selectEp.addEventListener("click", () => showControls());
window.addEventListener("mousemove", () => showAndHideControls());
player.addEventListener("click", () => showAndHideControls());
percentage.addEventListener("change", () => changePlayerTime());

setInterval(() => {
  if (isPlaying) {
    const progress = document.querySelector(".percentage");
    const time = document.querySelector(".current-time");
    const duration = player.duration;
    const currentTime = player.currentTime;
    const percent = (currentTime / duration) * 100;
    time.innerText = prettyTime(currentTime || 00);
    progress.value = percent;
  }
}, 1000);

const onInitAnime = () => {
  checkForUpdates();
  animes = getDataFromLocalStorage();
  validateQueryParam();

  id = Number(searchParams.get("id"));

  index = animes.findIndex((x) => x.id === id);
  anime = animes[index];

  if (!anime) document.location.href = "/";

  setAnime();
  setName();
  populateSelect();
  updateSelect();

  setInterval(() => {
    saveCurrentStatus();
  }, 60000);
};

onInitAnime();
