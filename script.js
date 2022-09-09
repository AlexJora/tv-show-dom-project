// the episode's name
// the season number
// the episode number
// the episode's medium-sized image
// the episode's summary text
// You should combine season number and episode number into an episode code:
// Each part should be zero-padded to two digits.
// Example: S02E07 would be the code for the 7th episode of the 2nd season. S2E7 would be incorrect.
// Your page should state somewhere that the data has (originally) come from TVMaze.com, and link back to that site (or the specific episode on that site). See tvmaze.com/api#licensing.




//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}
function createEpisodeElement(data) {
  // create a div element
  let div = document.createElement('div');

  // add the innerHTML to list all the data
  let season = data.season.toString();
  season = season.padStart(2, '0');
  number = data.number.toString();
  number = number.padStart(2, '0');

  div.innerHTML = `
  <div class = 'nameSeasonNumber'>${data.name} - S${season} E${number} </div>
  <div class = 'content'>
    <img src ='${data.image.medium}'/> 
    <p>${data.summary}</p>
  </div>
  `
  div.className = 'episodeItem';
  // return the final div
  return div;

}


function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");


  for (const episodeData of episodeList) {
    let episodeElem = createEpisodeElement(episodeData);
    rootElem.appendChild(episodeElem);

  }


}

window.onload = setup;
