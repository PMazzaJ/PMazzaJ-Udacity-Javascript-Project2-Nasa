let store = {     
    selectedRover: '', 
    launchDate: '',
    landingDate: '',
    status: '',
    latestPhotos: '',
    latestPhotosDate: '',
    rovers: Immutable.List(['Spirit', 'Opportunity', 'Curiosity'])
}

/**
* @description add our markup to the page
*/
const root = document.getElementById('root')

/**
* @description updates store and app ui
* @param {state, state} - Store, new version of store
*/
const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

/**
* @description create content
* @param {state} - Store
*/
const App = (state) => {
    
    return `        
        <main>  
            <section>               
                <div class="rovers-container">
                    <h1>Mars Rover Dashboard</h1>
                    ${createRoverSelectionCards(state)}
                </div>
                <div class="selected-rover-data">
                     ${renderRoverData(state)}
                </div>                           
            </section>
        </main>        
    `
}

/**
* @description listening for load event because page should load before any JS is called
*/
window.addEventListener('load', () => {
    render(root, store)
});

/**
* @description Create section for rover selection
* @param {state} - Store holding all rovers 
* @returns {HTMLUListElement} - List of rovers to be selected
*/
const createRoverSelectionCards = (state) => {   

    let roverCards = ``;

    roverCards = state.rovers.reduce((acc, rover) => {
        return acc += `<li class="cards_item"><div class="card"><div class="card_content"><button onClick="getSelectedRoverData(this)" data-rover="${rover}" class="btn card_btn rover">${rover}</button></div></div></li>`;
    }, roverCards);   

    return `                    
            <ul class="cards">
                ${roverCards}    
            </ul>          
    `
}

/**
* @description fetch rover facts and latest photos
* @param {HTMLButtonElement} - Button holding selected rover in dataset 
*/
const getSelectedRoverData = (roverBtn) => {   
    
    const roverName = roverBtn.dataset.rover;

    fetch(`http://localhost:3000/latest/${roverName}`)
    .then(response => response.json())
    .then(data => {           
                
        const latestPhotosUrls = data.roverData.latest_photos.map((photo) => {
            return photo.img_src
        });

        updateStore(store, { 
            selectedRover: roverBtn.dataset.rover, 
            launchDate: data.roverData.latest_photos[0].rover.launch_date ,
            landingDate: data.roverData.latest_photos[0].rover.landing_date ,            
            status: data.roverData.latest_photos[0].rover.status,     
            latestPhotos: latestPhotosUrls,
            latestPhotosDate: data.roverData.latest_photos[0].earth_date                   
        });      

        }).catch(err => console.log(err)
    );
}

/**
* @description Create html structure presenting facts and latest photos of selected rover
* @param {state} - Store holding selected rover data
* @returns {HTMLElement} - Selected rover data 
*/
const renderRoverData = (state) => {  
       
    if (state.selectedRover == undefined || state.selectedRover == '') {        
        return '';
    }    

    const roverName = state.selectedRover; 

    return `        
        <hr class="solid">
        <h1>${roverName} Data</h1>        
        <ul class="cards">
            <li class="cards_item">
                ${createRoverDataCard('Launch Date', state.launchDate)}                                   
            </li>

            <li class="cards_item">               
                ${createRoverDataCard('Landing Date', state.landingDate)}                                  
            </li>

            <li class="cards_item">
                ${createRoverDataCard('Status' ,state.status)}
            </li>
        </ul>

        <hr class="solid">
        <h1>Latest Photos</h1>        
        <h2>${state.latestPhotosDate}</h2>        
        <ul class="cards">
            ${createImagesLayout(state)}
        </ul>
    `
}

/**
* High Order Function
* 
* @description Create a card structure with divs that presents data based on the selected rover
* @param {String, String} - First param is a key (data title), second param is some rover data
* @returns {Function} - callback function  
*/
const createRoverDataCard = (key, roverData) => {

    function renderRoverDataCard() {
        return `<div class="card">
                    <div class="card_content_bottom">
                        <button class="btn card_btn">
                            ${key}: ${roverData}                
                        </button>                    
                    </div>
                </div>
        `
    }

    return renderRoverDataCard();
}

/**
* @description Create a card that presents one of the latest photos taken by the selected rover
* @returns {HTMLElement} - li that holds an image 
*/
const createImagesLayout = (state) => {

    const roverPictures = state.latestPhotos;   

    const roverPictureCards = roverPictures.map((url) => {        
        return `
            <li class="cards_item">           
                <img src="${url}" alt="Nasa Photo">
            </li>                        
        `
    }).join(''); //fix weird comma appearing in DOM

    return roverPictureCards
}
