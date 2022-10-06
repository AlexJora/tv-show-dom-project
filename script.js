// let episodes = [];

// function getAllEpisodesFromAPI() {
//   fetch("https://api.tvmaze.com/shows/82/episodes")
//     .then((req) => req.json())
//     .then((data) => {
//       episodes = data; // store the data in the global variable

//       makePageForEpisodes(episodes); // make the page
//     });
// }

// function setup() {
//   getAllEpisodesFromAPI();
// }
// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }
function setup() {
  const allEpisodes = getAllEpisodes();
  const allShows = getAllShows();
  makePageLayout()
  makeShowSelector(allShows);
  makeShowView(allShows)
}


// to add zeros if season and number is under 10
function pad(episodeData) {
  let { season, number } = episodeData;
  let code = "S";
  if (season < 10) {
    code += "0" + season;
  } else {
    code += season;
  }
  if (number < 10) {
    code += "0" + number;
  } else {
    code += number;
  }
  return code;
}
//episode element
function createEpisodeElement(episodeData) {
  let episode = document.createElement("div");
  episode.className = "episodeItem";
  episode.innerHTML = `
  <h2>${episodeData.name} - ${pad(episodeData)}</h2>
  <div class="image">
    <img src=${episodeData?.image?.medium} alt='${episodeData.season} ${episodeData.name
    }'/>
  </div>
  <div class="description">
    ${episodeData.summary}
  </div>
  `;
  return episode;
}
//show element
function createShowElement(showData) {
  let show = document.createElement("div");
  show.className = "showItem";
  // console.log(showData);
  show.innerHTML = `
  <h2>${showData.name}</h2>
  <div class="image">
    <img src =${showData?.image?.medium} alt = '${showData.name}'/>
  </div>
  <div class="description">
    ${showData.summary}
  </div>
  <ul class='list'>
  <li>Rated: ${showData.rating.average}</li>
  <li>Genres: ${showData.genres}</li>
  <li>Status: ${showData.status}</li>
  <li>Runtime: ${showData.runtime}</li>
  </ul>

  `;
  return show;

}
//header
function createHeader() {
  let header = document.createElement("div");
  header.className = "header";
  // add search
  // add select show
  // add select episode
  header.innerHTML = `
  <h2 class= 'title'>TV SHOW PROJECT</h2>
  <div class='container'>
  <button class='backButton'> HOME </button>
  <form><input type ='search' class = 'search' placeholder = 'SEARCH...'/><span id ='count'></span></form>
  <select class='select2'><option value="" selected="selected" hidden="hidden">SELECT SHOW:</option></select>
  <select class='select'><option value="" selected="selected" hidden="hidden">SELECT EPISODE:</option></select>
  </div>
`
  let btn = header.querySelector('.backButton');
  btn.addEventListener('click', (e) => {
    //hide episode selector
    let selectE = document.querySelector(".select");
    selectE.style.display = 'none';
    //home button
    makeHomeBtn()
  })

  return header
}

//section 
function createSection() {
  let section = document.createElement("div");
  section.className = "section";
  let link = document.createElement("div");
  link.className = 'maze';
  link.innerHTML = `Originally, data was obtained from <a href = 'https://www.tvmaze.com/' target= '_blank'>TVMaze.com</a>`
  section.appendChild(link);
  return section;
}

//popup episode at selection
let episodes = []; // global variable

function createPopUp(episodeId) {
  episodeId = parseInt(episodeId)
  const popUp = document.createElement("div");
  popUp.id = "popupEpisode";
  popUp.className = "episodeItem";

  // 1. find the episode with this id
  const allEpisodes = episodes;
  console.log(episodeId, allEpisodes);
  const episodeData = allEpisodes.find((episode) => episode.id === episodeId);

  popUp.innerHTML = `
  <button id="popupCloseBtn">X</button>
  <h2>${episodeData.name} - ${pad(episodeData)}</h2>
  <div class="image">
    <img src=${episodeData.image.medium} alt='${episodeData.season} ${episodeData.name
    }'/>
  </div>
  <div class="description">
    ${episodeData.summary}
  </div>
`;

  // button for closing the popUp:
  //get the button and add event listener
  let closeBtn = popUp.children[0];
  closeBtn.addEventListener("click", (e) => {
    // remove the popup from the DOM
    popUp.remove();
  });

  return popUp;
}


function makePageLayout() {
  const rootElem = document.getElementById("root");
  //header
  let header = createHeader();
  rootElem.appendChild(header);
  //section
  let section = createSection();
  // section will contain episodes, so it is hidden at the beginning
  section.style.display = 'none';
  rootElem.appendChild(section);
  let selectE = document.querySelector(".select");
  selectE.style.display = 'none';
  // the popup will show the chosen episode.
  // when selected value changes, a popup with the episode will open
  selectE.addEventListener("change", (e) => {
    let episodeId = e.target.value;
    const popUp = createPopUp(episodeId);
    rootElem.appendChild(popUp);
  });


}

function makeHomeBtn() {
  let section = document.querySelector('.section')
  let showView = document.querySelector('.showView')

  if (section.style.display == 'none') {
    section.style.display = '';
  } else {
    section.style.display = 'none';
  }

  if (showView.style.display == 'none') {
    showView.style.display = '';
  } else {
    showView.style.display = 'none';

  }
}

function hideShowView() {
  let section = document.querySelector('.section')
  let showView = document.querySelector('.showView')
  section.style.display = '';

  showView.style.display = 'none';

}

//to display page
function makePageForEpisodes(episodeList) {
  //search episodes
  let counter = document.getElementById("count");
  let input = document.querySelector(".search");
  input.addEventListener("keyup", (event) => {

    const searchString = event.target.value.toLowerCase();
    const episodeDivs = document.querySelectorAll(".episodeItem");
    let countEpisodes = 0;


    // Checks if each div contains the search string and if not sets display to none
    for (let i = 0; i < episodeDivs.length; i++) {
      if (!episodeDivs[i].innerHTML.toLowerCase().includes(searchString)) {
        episodeDivs[i].style.display = "none";
      } else {
        episodeDivs[i].style.display = "block";
        countEpisodes++;
      }
    }
    counter.innerText = `Displaying   ${countEpisodes}/72 episode's`;
  });
  //end of search episodes
  let section = document.querySelector('.section');
  //display episodes
  // remove old episodes
  while (section.children.length > 0) {
    section.children[0].remove()
  }
  for (const episodeData of episodeList) {
    let episodeElem = createEpisodeElement(episodeData);
    section.appendChild(episodeElem);

  }
  // episode select
  let selectE = document.querySelector(".select");
  let firstOption = document.createElement(`option`);

  // firstOption.setAttribute(`value`, `select an option`);
  // firstOption.innerText = `Select Episode:`;
  // firstOption.selected = true;
  // firstOption.disabled = true;
  // selectE.appendChild(firstOption);

  // create the options for the select:
  while (selectE.children.length > 0) {
    selectE.children[0].remove()
  }
  for (const episodeData of episodeList) {
    let option = document.createElement("option");
    option.className = "selectOption";
    option.value = episodeData.id;
    option.innerText = ` ${pad(episodeData)} - ${episodeData.name
      }`;
    selectE.appendChild(option);
    console.log(episodeList)
  }
}

//creates DIV containing show elements (showView)
function makeShowView(showList) {
  //search show
  let span = document.getElementById("count");
  let input = document.querySelector(".search");
  input.addEventListener("keyup", (event) => {

    const searchString = event.target.value.toLowerCase();
    const showDivs = document.querySelectorAll(".showItem");
    let countShows = 0;


    // Checks if each card contains the search string and if not sets display to none
    for (let i = 0; i < showDivs.length; i++) {
      if (!showDivs[i].innerHTML.toLowerCase().includes(searchString)) {
        showDivs[i].style.display = "none";
      } else {
        showDivs[i].style.display = "block";
        countShows++;
      }
    }
    span.innerText = `Displaying ${countShows}/301 show's`;

  });

  //end search
  let rootElem = document.querySelector('#root')
  let showView = document.createElement('div');
  showView.className = 'showView';
  rootElem.append(showView);

  for (const showData of showList) {
    // we create show elements and add to DIV (showView)
    let showElem = createShowElement(showData);
    showView.append(showElem);
  }

}


// run once when loading the page. You must call this after calling makePageLayout()
function makeShowSelector(showList) {
  //show select
  let selectS = document.querySelector('.select2');
  // let firstOption = document.createElement(`option`);
  // selectS.appendChild(firstOption);
  // firstOption.setAttribute(`id`, `firstShow`);
  // firstOption.setAttribute(`value`, `select an option`);
  // firstOption.textContent = `Select Show:`;
  // firstOption.selected = true;
  // firstOption.disabled = true;


  //option for select
  for (const showData of showList) {
    let optionForShow = document.createElement("option");
    optionForShow.className = "selectOptionForShow";
    optionForShow.value = showData.id;
    optionForShow.innerText = `${showData.name}`;
    selectS.appendChild(optionForShow);

  }

  selectS.addEventListener("change", (e) => {
    //show episode selector
    let selectE = document.querySelector(".select");
    selectE.style.display = '';

    let showId = e.target.value;
    // fetch data from API
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then(res => res.json())
      .then(allEpisodes => {
        makePageForEpisodes(allEpisodes)
        episodes = allEpisodes; // copy data to global variable
        hideShowView();
      })
      .catch(err => console.error(err))
  });

}


window.onload = setup;