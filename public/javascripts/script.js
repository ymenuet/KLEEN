mapboxgl.accessToken = 'pk.eyJ1IjoieW1lbnVldCIsImEiOiJja2V1OGw5emowMXhzMnpudzJzMW9rM2pjIn0.ClSDpO_UqVo2gsMkUjma2w';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-99.133209, 19.432608],
    zoom: 11
});