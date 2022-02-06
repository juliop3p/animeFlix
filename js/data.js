let data = [
  {
    id: "01",
    name: "One Piece",
    url: "https://pitou.goyabu.com/one-piece/",
    videoType: "mp4",
    image: "https://sm.ign.com/ign_br/tv/o/one-piece-/one-piece-2_1xby.jpg",
    state: {
      currentEp: "01",
      currentTime: 00,
    },
  },
  {
    id: "02",
    name: "Naruto Shippuden",
    url: "https://pitou.goyabu.com/naruto-shippuden/",
    videoType: "mp4",
    image:
      "https://i.pinimg.com/originals/14/dd/71/14dd71fc80364fb1b3721967cc652669.jpg",
    state: {
      currentEp: "01",
      currentTime: 00,
    },
  },
  {
    id: "03",
    name: "One Punch Man",
    url: "https://pitou.goyabu.com/one-punch-man/",
    videoType: "mp4",
    image: "https://tm.ibxk.com.br/2022/01/17/17122119315209.jpg?ims=1200x675",
    state: {
      currentEp: "01",
      currentTime: 00,
    },
  },
  {
    id: "04",
    name: "Death Note",
    url: "https://pitou.goyabu.com/death-note/",
    videoType: "mp4",
    image:
      "https://oxentesensei.com.br/wp-content/uploads/2021/06/Death-Note-terminou-capa.jpg",
    state: {
      currentEp: "01",
      currentTime: 00,
    },
  },
];

const getDataFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("data"));
};

const saveDataInLocalStorage = () => {
  localStorage.setItem("data", JSON.stringify(data));
};

const mergeObjects = (object, objectLocalStorage) => {
  const newObject = object.map((obj) => {
    const index = objectLocalStorage.findIndex((x) => x.id === obj.id);

    if (index === -1) {
      return obj;
    }

    const animeLocalStorage = objectLocalStorage[index];

    return {
      id: obj.id,
      name: obj.name,
      url: obj.url,
      videoType: obj.videoType,
      image: obj.image,
      state: {
        currentEp: animeLocalStorage.state.currentEp,
        currentTime: animeLocalStorage.state.currentTime,
      },
    };
  });

  return newObject;
};

const onInit = () => {
  const dataFromLocalStorage = getDataFromLocalStorage();

  if (dataFromLocalStorage) {
    data = mergeObjects(data, dataFromLocalStorage);
  }
};

onInit();
