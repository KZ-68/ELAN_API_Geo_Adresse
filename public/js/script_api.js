var map = L.map('my-map').setView([51,5, -0.09], 4);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const inputCodeP = document.querySelector(".codep");
const selectVille = document.querySelector(".ville");
let selectArea = document.getElementById("ville");

let apiKeyChildGet = document.getElementById("api-key");
let apiKeyChildString = apiKeyChildGet.innerText;

inputCodeP.addEventListener('input', () => {
    let value = inputCodeP.value;
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${value}&fields=region,nom,code,codesPostaux,codeRegion&format=json&geometry=centre`)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((ville) => {
                if(data != null) {
                    selectArea.style.visibility = "visible";
                }
                
                let option = document.createElement('option')
                option.value = `${ville.code}`
                option.innerHTML = `${ville.nom}`
                selectVille.appendChild(option)
            })
        })

    if(value === '') {
        let selectVilleoptions = selectVille.querySelectorAll('option')
        selectVilleoptions.forEach((option) => {
            selectVille.removeChild(option);
        })
        selectArea.style.visibility = 'hidden';
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {   
                map.removeLayer(layer)
            }
        });
        map.setView(new L.LatLng(51,5, -0.09), 4);
    }
})

selectVille.addEventListener("change", function() {
    let selectedVille = this.options[this.selectedIndex].text

    var requestOptions = {
        method: 'GET',
    };
      
    fetch(`https://api.geoapify.com/v1/geocode/search?text=${selectedVille}&apiKey=${apiKeyChildString}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            let lat = result['features'][0]['properties']['lat'];
            let lon = result['features'][0]['properties']['lon'];

            map.setView(new L.LatLng(lat, lon), 10);
            L.marker([lat, lon]).addTo(map)
        })
        .catch(error => console.log('error', error));
});  