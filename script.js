let page = 1;
let range = 10;
let data;
let currentPage = 1;

const rangeValue = document.querySelector("#rangeValue");
const repoList = document.querySelector(".repo-list");
const loader = document.querySelector(".loader");

const fetchRepo = async (page, range) => {
  try {
    loader.style.display = "block";

    // API CALL FOR USER DATA
    let OwnerResponse = await fetch("https://api.github.com/users/johnpapa");
    Ownerdata = await OwnerResponse.json();

    // API CALL FOR DISPLAYING REPOS

    let URL = `https://api.github.com/users/johnpapa/repos?page=${page}&per_page=${range}`;
    let response = await fetch(URL);
    data = await response.json();

    displayUserData(Ownerdata);
    displayRepo(data, range);

    loader.style.display = "none";
  } catch (error) {
    console.error("Error fetching repositories:", error);
  }
};

function displayUserData(Ownerdata) {
  const userInfo = document.querySelector(".user-info");

  userInfo.innerHTML = `<img src="images/dp.png" alt="User Photo"/>
<h2> ${Ownerdata.name}</h2>

<p> location: ${Ownerdata.location}</p>
<p>twitter_username: ${Ownerdata.twitter_username}</p>
<p>Bio : ${Ownerdata.bio}</p>
<p>company : ${Ownerdata.company}</p>`;
}

function displayRepo(data, range) {
  let allRepos = "";
  data.slice(0, range).forEach((repo) => {
    allRepos += `<div class="repo-item">
      <h3>${repo.name}</h3>
      <p>${repo.description}</p>
      <ul class="topic">`;

    if (typeof repo.language === "string") {
      const languages = repo.language.split(",").map((lang) => lang.trim());

      languages.forEach((language) => {
        allRepos += `<li>${language}</li>`;
      });
    } else {
      allRepos += "<li>No languages specified</li>";
    }

    allRepos += `</ul></div>`;
  });

  repoList.innerHTML = allRepos;
}

function handleRange() {
  const rangeInput = document.getElementById("repo-display-range");

  rangeInput.addEventListener("input", () => {
    const value = parseInt(rangeInput.value);
    rangeValue.innerText = value;
    range = value;
    fetchRepo(page, range);

    // console.log(range)
  });
}

// HANDLING  PAGINATION
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    handleActivePage(currentPage - 1);
  }
});

nextPageButton.addEventListener("click", () => {
  if (currentPage < 8) {
    handleActivePage(currentPage + 1);
  }
});

function handleActivePage(page) {
  document.querySelector(".active").classList.remove("active");

  currentPage = page;
  console.log(currentPage);
  document.querySelector(`#page${currentPage}`).classList.add("active");
  console.log(`Active Page: ${currentPage}`);

  fetchRepo(currentPage, range);
}

// HANDLED  PAGINATION

fetchRepo(currentPage, range);
handleRange();
