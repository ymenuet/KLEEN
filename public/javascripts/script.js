mapboxgl.accessToken = 'pk.eyJ1IjoieW1lbnVldCIsImEiOiJja2V1OGw5emowMXhzMnpudzJzMW9rM2pjIn0.ClSDpO_UqVo2gsMkUjma2w';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-99.133209, 19.432608],
    zoom: 11
});

const $selectCategory = document.querySelector('#place-category')
const $otherCategory = document.querySelector('.other-category-fields')

function checkOther() {
    if ($selectCategory.value === 'Other') $otherCategory.style.display = 'block'
    else $otherCategory.style.display = 'none'
}

function displayFileName() {
    document.querySelector(".custom-file-label").innerHTML = document.querySelector(".custom-file-input").value;
}

const moment = require("moment")