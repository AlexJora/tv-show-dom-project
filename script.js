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
  <button class='backButton'>  HOME  </button>
  <form><input type ='search' class = 'search' placeholder = 'your search term...'/><span class = 'searchOutput'> <span>Displaying 73/73 episodes</span> 
  </span></form>
  <select class='select2' placeholder = 'Select show:'></select>
  <select class='select'  placeholder = 'Select episode:'></select>
  
`
  let btn = header.querySelector('.backButton');
  btn.addEventListener('click', (e) => {

    //home button
    makeHome()
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
//search
function onInputSearch(e) {
  let episodeList = episodes; // copy from the global variable named episodes
  // first remove from the DOM all divs of class .episodeItem
  let episodeDivs = document.getElementsByClassName("episodeItem");
  let parentOfEpisodes = document.querySelector(".section");
  //how long are episodes
  while (episodeDivs.length > 0) {
    let episodeDiv = episodeDivs[0];
    parentOfEpisodes.removeChild(episodeDiv);
  }
  // console.log(e.target.value);

  // the query is empty, we should use al movies
  let query = e.target.value.toLowerCase();
  let filteredEpisodeList;
  if (query.length === 0) {
    // use all movies
    filteredEpisodeList = [...episodeList];
  } else {
    filteredEpisodeList = episodeList.filter((episode) => {
      let episodeName = episode.name.toLowerCase();
      let episodeSummary = episode.summary.toLowerCase();

      if (episodeName.includes(query) || episodeSummary.includes(query)) {
        return true;
      } else {
        return false;
      }
    });
  }
  // 1st effect: show the filtered episoded
  let section = document.querySelector('.section')
  for (const episodeData of filteredEpisodeList) {
    let episodeElem = createEpisodeElement(episodeData);
    section.appendChild(episodeElem);
  }
  // 2nd effect: displaying how many episodes the site is showing
  let searchOutputSpan = document.querySelector(".searchOutput");
  searchOutputSpan.innerText = `Displaying ${filteredEpisodeList.length}/73`;
}

function makePageLayout() {
  const rootElem = document.getElementById("root");
  //header
  let header = createHeader();
  rootElem.appendChild(header);
  //section
  let section = createSection();
  // // section will contain episodes, so it is hidden at the beginning
  // section.style.display = 'none';
  rootElem.appendChild(section);

  // input and the span:
  let input = document.querySelector("input.search");
  // add event handler for input change
  input.addEventListener("input", onInputSearch);



  let selectE = document.querySelector(".select");
  // selectE.style.display = 'none';
  // the popup will show the chosen episode.
  // when selected value changes, a popup with the episode will open
  selectE.addEventListener("change", (e) => {
    let episodeId = e.target.value;
    const popUp = createPopUp(episodeId);
    rootElem.appendChild(popUp);
  });
}

function makeHome() {
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

  firstOption.setAttribute(`value`, `select an option`);
  firstOption.innerText = `Select Episode:`;
  firstOption.selected = true;
  firstOption.disabled = true;
  selectE.appendChild(firstOption);

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
  }
}

//creates DIV containing show elements (showView)
function makeShowView(showList) {
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
  let firstOption = document.createElement(`option`);
  selectS.appendChild(firstOption);
  firstOption.setAttribute(`id`, `firstShow`);
  firstOption.setAttribute(`value`, `select an option`);
  firstOption.textContent = `Select Show:`;
  firstOption.selected = true;
  firstOption.disabled = true;

  //option for select
  for (const showData of showList) {
    let optionForShow = document.createElement("option");
    optionForShow.className = "selectOptionForShow";
    optionForShow.value = showData.id;
    optionForShow.innerText = `${showData.name}`;
    selectS.appendChild(optionForShow);

  }

  selectS.addEventListener("change", (e) => {
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
