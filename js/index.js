const selectUser = document.getElementById("users");
let user;

const createCardsAnimes = () => {
  const containerAnimes = document.querySelector(".animes");

  if (!animes) {
    document.querySelector("h1").innerText = "Não há animes para exibir";
    return;
  }

  animes.forEach((anime) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const small = document.createElement("small");
    const containerPercentage = document.createElement("div");
    const percentage = document.createElement("div");

    containerPercentage.className = "container-percentage";
    percentage.className = "percentage";
    percentage.style.width = `${Math.floor(
      (anime.state.currentTime / 1500.0) * 100
    )}%`;

    containerPercentage.appendChild(percentage);

    li.className = "anime";
    small.innerText = `${anime.name} - ${anime.state.currentEp}`;
    small.classList = "ep-details";
    img.src = anime.image;
    a.href = `/anime.html?id=${anime.id}`;

    a.appendChild(img);
    a.appendChild(containerPercentage);
    a.appendChild(small);
    li.appendChild(a);
    containerAnimes.appendChild(li);
  });
};

const populateSelectWithUsers = () => {
  if (usersFromServer) {
    usersFromServer.forEach((user) => {
      const opt = document.createElement("option");
      opt.innerHTML = user.name;
      selectUser.appendChild(opt);
    });
  }
};

const onSelectChange = () => {
  user = selectUser.value;
  localStorage.clear();
  localStorage.setItem("user", user);
  location.reload();
};

const createUser = () => {
  const username = document.getElementById("usernameInput").value;

  if (
    typeof username === "string" &&
    username.length > 2 &&
    username.length < 10
  ) {
    console.info("[INFO] - CRIANDO USUÁRIO");
    fetch(`https://apianimes.herokuapp.com/api/User?username=${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.status === 201) {
        localStorage.setItem("user", username);
        alert("Usuário Criado Com Sucesso!");
        return location.reload();
      }

      if (res.status === 400) {
        return alert("Usuário Já Existe!");
      }

      alert("Oops! Algo deu errado.");
    });
  }
};

const updateSelect = () => {
  const options = selectUser.querySelectorAll("option");

  options.forEach((opt) => {
    if (opt.innerText === user) {
      opt.selected = true;
    }
  });
};

const onInitIndex = () => {
  user = localStorage.getItem("user");
  createCardsAnimes();
  populateSelectWithUsers();
  updateSelect();
};
