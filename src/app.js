const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
}

const main = async (withIP = true) => {
    let ville;
    if (withIP) {
        if ('geolocation' in navigator) {
            /* la géolocalisation est disponible */
            navigator.geolocation.getCurrentPosition((position) => {
                showPosition(position);
            });
            
        } else {
            //la géolocalisation n\'est pas disponible
            showError();
        }
    } else {
        displayLocation();
    }
}

const showPosition = (position) => {
    lat=position.coords.latitude;
    lon=position.coords.longitude;
    displayLocation(lat,lon);
}

const showError = (error) => {
    switch(error.code){
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
        break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
        break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
        break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
        break;
    }
}

const displayLocation = async (latitude,longitude) => {

    if (latitude,longitude) {
        let geocoder;
        geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(latitude, longitude);

        geocoder.geocode(
        {'latLng': latlng}, 
        async (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {

                    let add = results[0].formatted_address ;
                    let value = add.split(",");
                    let myCity = document.getElementById("city");

                    count = value.length;
                    city = value[count-3];
                    myCity.textContent = city;

                    const str = city
                    const town = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    
                    const meteo = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${town}&appid=a28db2454a4c2c1d1b53fd342abf8f91&lang=fr&units=metric`)
                    .then(result => result.json())
                    .then(json => json)
                    //console.log(meteo);
                    displayWeather(meteo);

                } else  {
                    console.log("address not found");
                }
                
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });
    } else {
        town = document.querySelector('#city').textContent;
        const meteo = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${town}&appid=a28db2454a4c2c1d1b53fd342abf8f91&lang=fr&units=metric`)
                .then(result => result.json())
                .then(json => json)
                //console.log(meteo);
                displayWeather(meteo);
    }
};

const displayWeather = (data) => {
    
    //const city = data.name;
    const temperature = data.main.temp;
    const weather = data.weather[0].description;
    const icon = data.weather[0].icon;
    const conditions = data.weather[0].main;
    console.log(weather);
    console.log(conditions);
    
    //document.querySelector('#city').textContent = city;
    document.querySelector('#temperature').textContent = Math.round(temperature);
    document.querySelector('#description').textContent = capitalize(weather);
    document.querySelector('img').src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    document.body.className = conditions.toLowerCase();
}

const ville = document.querySelector('#city');

ville.addEventListener('click', () => {
    ville.contentEditable = true;
});

ville.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        ville.contentEditable = false;
        main(false);
    }
});
main();