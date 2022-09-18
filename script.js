
let episodes = [];

function getAllEpisodesFromAPI() {
  fetch('https://api.tvmaze.com/shows/82/episodes')
    .then(req => req.json())
    .then(data => {
      episodes = data; // store the data in the global variable
      // console.log(data);
      makePageForEpisodes(episodes); // make the page
    });
  // return data;
}


function setup() {
  getAllEpisodesFromAPI();
}


//to add zeros if season and number is under 10
function padSeasonAndEpisode(episodeData) {
  let { season, number } = episodeData;

  let code = 'S';

  if (season < 10) {
    code += '0' + season;
  } else {
    code += season;
  }

  if (number < 10) {
    code += '0' + number;
  } else {
    code += number;
  }

  return code;
}


//episode
function createEpisodeElement(episodeData) {
  let episode = document.createElement('div')

  episode.className = 'episodeItem'
  episode.innerHTML = `
    <h2>${episodeData.name} - ${padSeasonAndEpisode(episodeData)}</h2>
    <div class="image">
      <img src=${episodeData.image.medium} alt='${episodeData.season} ${episodeData.name}'/>
    </div>
    <div class="description">
      ${episodeData.summary}
    </div>
    
    `;

  return episode;
}


//header
function createHeader() {
  const rootElem = document.getElementById("root")
  let header = document.createElement('div');
  header.className = 'header';
  rootElem.appendChild(header);
  let title = document.createElement('h1');
  header.appendChild(title);
  title.innerHTML = 'TV show project';

}

//section (with episodes)
function createSection() {
  const rootElem = document.getElementById("root")
  let section = document.createElement('div');
  section.className = 'section';
  rootElem.appendChild(section);
  return section;


}
//Your page should state somewhere that the data has (originally) come from TVMaze.com, and link back to that site (or the specific episode on that site). See tvmaze.com/api#licensing.

function createMazeDiv() {
  const header = document.querySelector('.header');
  let maze = document.createElement('div');
  maze.className = 'mazeDiv';
  header.appendChild(maze);
  maze.innerHTML = `Originally, data was obtained from <a href = 'https://www.tvmaze.com/' target= '_blank'>TVMaze.com</a>`;
  return maze;

}

//search 
function createSearchBar() {
  let form = document.createElement('form');
  form.innerHTML = `<input type ='search' class = 'search' placeholder = 'your search term...'/><span class = 'searchOutput'> Displaying 73/73 episodes 
  
  </span>`;
  return form;
}
//select
function createSelect() {
  const header = document.querySelector(".header")
  let select = document.createElement('select');
  select.className = 'select';
  header.appendChild(select);
}

// write a function which creates a popup episode
function createPopUp(episodeId) {
  const popUp = document.createElement('div');
  popUp.id = 'popupEpisode';
  popUp.className = 'episodeItem';

  // 1. find the episode with this id
  const allEpisodes = episodes;
  const episodeData = allEpisodes.find(
    (episode) => episode.id == episodeId
  )
  // 2. used the episode to fill in the details about the film
  popUp.innerHTML = `
    <button id="popupCloseBtn">X</button>
    <h2>${episodeData.name} - ${padSeasonAndEpisode(episodeData)}</h2>
    <div class="image">
      <img src=${episodeData.image.medium} alt='${episodeData.season} ${episodeData.name}'/>
    </div>
    <div class="description">
      ${episodeData.summary}
    </div>
  `

  // button for closing the popUp:
  //get the button and add event listener
  let closeBtn = popUp.children[0];
  closeBtn.addEventListener(
    'click',
    (e) => {
      // remove the popup from the DOM
      popUp.remove();
    })

  return popUp;
}

//to display page
function makePageForEpisodes(episodeList) {
  //display header
  createHeader();
  let header = document.querySelector('.header');
  //display select
  createSelect();
  let select = document.querySelector('select')
  // create the options for the select:
  for (const episodeData of episodeList) {
    let option = document.createElement('option')
    option.className = 'selectOption';
    option.value = episodeData.id;
    option.innerText = ` ${padSeasonAndEpisode(episodeData)} - ${episodeData.name}`
    select.appendChild(option);
  }
  //display search bar
  let searchBar = createSearchBar();
  header.appendChild(searchBar);
  //display section
  createSection();
  let section = document.querySelector('.section');
  //display episodes
  for (const episodeData of episodeList) {
    let episodeElem = createEpisodeElement(episodeData);
    section.appendChild(episodeElem);
  }
  //display about TV Maze.com
  createMazeDiv();
  let maze = document.querySelector('.mazeDiv');

  // we grab the input and the span:
  let input = document.querySelector('input.search');
  let span = document.querySelector('span.searchOutput');

  // add the popup
  // the popup will show the chosen episode.
  const rootElem = document.querySelector('#root');
  // when selected value changes, a popup with the episode will open
  select.addEventListener(
    'change',
    (e) => {
      console.log(e.target.value)
      let episodeId = e.target.value
      const popUp = createPopUp(episodeId); // create popup for episode with id=4952
      rootElem.appendChild(popUp);
    }
  )

}

window.onload = setup;






