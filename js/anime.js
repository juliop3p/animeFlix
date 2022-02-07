const player = document.querySelector(".player");
const selectEp = document.getElementById("eps");
const animeName = document.querySelector(".anime-name");
const searchParams = new URLSearchParams(window.location.search);

let id;
let index;
let anime;
let url;
let currentEp;

const urlBuilder = (anime) => {
  const { url, videoType, state } = anime;

  return `${url}${sanitazeEp(state.currentEp)}.${videoType}`;
};

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
  animeName.innerHTML = `${anime.name} - ${anime.state.currentEp}`;
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
  data[index] = anime;
  saveDataInLocalStorage();
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
  data[index] = anime;
  saveDataInLocalStorage();
};

const goBack = () => {
  saveCurrentStatus();
  document.location.href = "/";
};

player.addEventListener("ended", () => {
  onNextOrPrevEp("next");
});

const onInitAnime = () => {
  validateQueryParam();

  id = searchParams.get("id");
  index = data.findIndex((x) => x.id === id);
  anime = data[index];

  setAnime();
  setName();
  populateSelect();
  updateSelect();

  setInterval(() => {
    saveCurrentStatus();
  }, 60000);
};

onInitAnime();
