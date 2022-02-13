let animesFromLocalStorage;
let statesFromServer;
let usersFromServer;
let currentUser = "";
let animes;

const getInitialDataFromServer = (getUserState) => {
  const requests = [
    fetch("http://3.144.181.62/api/User"),
    fetch("http://3.144.181.62/api/Anime"),
  ];

  if (getUserState) {
    requests.push(fetch(`http://3.144.181.62/api/User/${currentUser}`));
  }

  console.info("[INFO] - GETTING INITIAL DATAS");

  Promise.all(requests)
    .then((responses) =>
      Promise.all(responses.map((response) => response.json()))
    )
    .then((data) => handleReturns(data));
};

const handleReturns = (data) => {
  // Handling Users
  if (data[0]) usersFromServer = data[0];

  // Handling Animes
  if (data[1]) animesFromServer = data[1];

  // Handling States
  if (data[2]) statesFromServer = data[2];

  if (data[1]) {
    addStateToData();

    saveDataInLocalStorage(animesFromServer);

    onInitIndex();
  }
};

const isUserLogged = () => currentUser !== "" && currentUser !== null;

const saveDataInLocalStorage = (data) => {
  if (animesFromLocalStorage && isUserLogged()) {
    animes = mergeObjects(data, animesFromLocalStorage);
    localStorage.setItem("animes", JSON.stringify(animes));
  } else if (animesFromLocalStorage && !isUserLogged()) {
    animes = mergeObjects(data, animesFromLocalStorage);
    localStorage.setItem("animes", JSON.stringify(animes));
  } else {
    animes = data;
    localStorage.setItem("animes", JSON.stringify(animes));
  }
};

const addStateToData = () => {
  animesFromServer.forEach((anime) => {
    if (statesFromServer) {
      const state = statesFromServer.states.find(
        (state) => anime.id === state.animeId
      );

      if (state) {
        anime.state = {
          id: state.id,
          animeId: state.animeId,
          currentEp: state.currentEp,
          currentTime: state.currentTime,
        };
      } else {
        anime.state = {
          animeId: anime.id,
          currentEp: "01",
          currentTime: 00,
        };
      }
    } else {
      anime.state = {
        animeId: anime.id,
        currentEp: "01",
        currentTime: 00,
      };
    }
  });
};

const mergeObjects = (object, objectLocalStorage) => {
  const newObject = object.map((obj) => {
    const index = objectLocalStorage.findIndex((x) => x.id === obj.id);

    if (index === -1) {
      return obj;
    }

    const animesLocalStorage = objectLocalStorage[index];

    if (obj?.state?.id) return obj;

    return {
      id: obj.id,
      name: obj.name,
      url: obj.url,
      videoType: obj.videoType,
      image: obj.image,
      state: {
        currentEp: animesLocalStorage.state.currentEp,
        currentTime: animesLocalStorage.state.currentTime,
      },
    };
  });

  return newObject;
};

const onInit = async () => {
  currentUser = localStorage.getItem("user");
  animesFromLocalStorage = JSON.parse(localStorage.getItem("data"));

  getInitialDataFromServer(currentUser !== "" && currentUser !== null);
};

onInit();
