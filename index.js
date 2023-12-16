// cinemas: 
// https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records'
// https://data.culture.gouv.fr/explore/dataset/etablissements-cinematographiques/api
let cinemasList = [];
let userLocation;
let cinemaFromUserLocation;
let cinemasNearMe = [];

let distanceCompare = function (data) {

    console.log(data)
    console.log(data[0].geolocalisation, userLocation)

    for (let i = 0; i < data.length; i++) {
        if (data[i].geolocalisation) {
            data[i].distanceFrom = distanceFrom(userLocation, data[i].geolocalisation)
        }
    }
    console.log(data);

    cinemasNearMe = data.sort((a, b) => {
        return a.distanceFrom - b.distanceFrom
    })
    cinemasList = cinemasNearMe.slice(0, 20)
    cinemasDisplayer(cinemasList)

}
// distance from
// ============================================
const distanceFrom = function (userloc, cinemaLoc) {
    // Rayon de la Terre en kilomètres (approximatif)
    const earthRadius = 6371;
    let lat1 = userloc.userLat
    let lon1 = userloc.userLong
    let lat2 = cinemaLoc.lat
    let lon2 = cinemaLoc.lon

    // Conversion des degrés en radians
    const lat1Rad = (Math.PI / 180) * lat1;
    const lon1Rad = (Math.PI / 180) * lon1;
    const lat2Rad = (Math.PI / 180) * lat2;
    const lon2Rad = (Math.PI / 180) * lon2;

    // Différence de latitude et de longitude
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Calcul de la distance en utilisant la formule de la haversine
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance en kilomètres
    const distance = earthRadius * c;
    return distance;
}

// // Pages index
// // =========================================
// const pagesIndexDisplayer = (data) => {
//     console.log(data)
// }

// Cinemas
// ==========================================

const cinemasDisplayer = (data) => {
    console.log(data)
    document.querySelector('main').innerHTML = ""
    if (data.length == 0) {
        document.querySelector('main').innerHTML += `
        Oh, nous n'avons trouvé aucuns cinmémas près de chez vous (c'est la crise... et pas une erreur du developpeur)
        `
    }
    for (let i = 0; i < data.length; i++) {

        document.querySelector('main').innerHTML +=
            `
        <div class="cinema" data.places="${data[i].fauteuils
            }">
        <p>Nom: ${data[i].nom}</p>
        <p>Adress: ${data[i].adresse}
        </p>
        <p>Ville: ${data[i].commune}</p>
        </div>
        `
    }
}

console.log("cinemas")

let baseUrlCinemas = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?limit=100&offset='

const cinemasFectherByPages = async (data) => {
    console.log(data)
    for (let i = 1; i < data; i++) {
        await fetch(baseUrlCinemas + i)
            .then((response) => response.json())
            .then((data) => {
                cinemasList.push(...data.results);
                i += 100;
            })
    }
    console.log(cinemasList)
    distanceCompare(cinemasList)
}

cinemasFetcher = function () {
    fetch('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?limit=20')
        .then((response) => response.json())
        .then((data) => {
            cinemasFectherByPages(data.total_count)
        })
}

// Adress by latt/lon
// ======================================================================================

const showPosition = function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    userLocation = {
        userLat: latitude,
        userLong: longitude
    }
    // console.log(userLocation)
    console.log(latitude, longitude)
    // adressFetcher(longitude, latitude)

    cinemasFetcher();

}

const getUserLocation = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// event listener and load
// ============================================================

// Just so there is always somes thing displayed on screen

window.addEventListener('load', () => {
    fetch('https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records?limit=20')
        .then((response) => response.json())
        .then((data) => {
            cinemasList = data.results
            cinemasDisplayer(data.results)
        });
});

const placesSorting = document.getElementById('places-sorting');
const distanceSorting = document.getElementById('distance-sorting');

placesSorting.addEventListener('click', () => {
    distanceSorting.classList.remove('clicked');
    placesSorting.classList.add('clicked')
    console.log(cinemasList)
    cinemasList = cinemasList.sort((a, b) => {
        return a.fauteuils - b.fauteuils
    })

    cinemasDisplayer(cinemasList)

});

distanceSorting.addEventListener('click', () => {
    distanceSorting.classList.add('clicked');
    placesSorting.classList.remove('clicked');

    document.querySelector('main').innerHTML =
        `
Un instant si il vous plait... je réfléchis...
`;
    getUserLocation()
});

document.getElementById('localisation-btn').addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('main').innerHTML =
        `
Un instant si il vous plait... je réfléchis...
`;
    getUserLocation()
});