mapboxgl.accessToken = 'pk.eyJ1IjoieW1lbnVldCIsImEiOiJja2Vrbzd2MzYwM3JiMnFxa2VxaWtzeG1oIn0.LPOW0TTdQPho2P4Tvc2QRA';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-99.133209, 19.432608],
    zoom: 11
});