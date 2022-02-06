const createCardsAnimes = () => {
  const containerAnimes = document.querySelector(".animes");

  if (!data) {
    document.querySelector("h1").innerText = "Não há animes para exibir";
  }

  data.forEach((anime) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    li.className = "anime";
    img.src = anime.image;
    a.href = `/anime.html?id=${anime.id}`;

    a.appendChild(img);
    li.appendChild(a);
    containerAnimes.appendChild(li);
  });
};

const onInitIndex = () => {
  createCardsAnimes();
};

onInitIndex();
