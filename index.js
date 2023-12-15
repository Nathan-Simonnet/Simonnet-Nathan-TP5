// cinemas: 
// https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records'
// https://data.culture.gouv.fr/explore/dataset/etablissements-cinematographiques/api


// Pages index
// =========================================
const pagesIndexDisplayer = (data) => {
    console.log(data)
}

// Cinemas
// ==========================================

const cinemasDisplayer = (data) => {

    console.log(data)

}

console.log("cinemas")

let urlCinemas = 'https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records'

cinemasFetcher = function () {

    fetch(urlCinemas)
        .then((response) => response.json())
        .then((data) => {
            cinemasDisplayer(data.results)
            pagesIndexDisplayer(data.total_count)

        })
}

cinemasFetcher();



// Adress
// ======================================================================================
const adressFetcher = function (lon, lat) {
    fetch('https://api-adresse.data.gouv.fr/reverse/?lon=' + lon + '&lat=' + lat)
        // fetch('https://api-adresse.data.gouv.fr/reverse/?lon=2.37&lat=48.357')
        // fetch('https://api-adresse.data.gouv.fr/reverse/?lon=2.37&lat=48.357&type=street')
        .then((response) => (response.json()))
        .then((data) =>
            console.log(data.features[0].properties))
}

const showPosition = function (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log(latitude, longitude)
    adressFetcher(longitude, latitude)
}

const getUserLocation = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

getUserLocation()