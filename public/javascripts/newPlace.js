window.onload = () => {
    const $lat = document.querySelector('#lat')
    const $lng = document.querySelector('#lng')
    const $errorMessage = document.querySelector('.error-location')
    if (!$lat.value || !$lng.value)
        $errorMessage.style.display = 'block';

    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
    geocoder.on('result', event => {
        const [lng, lat] = event.result.center
        $lat.value = lat
        $lng.value = lng
        $errorMessage.style.display = 'none';
    })
    map.addControl(geocoder)

    const $geocoderInput = document.querySelector('.mapboxgl-ctrl-geocoder--input')
    $geocoderInput.placeholder = "Type place or address"
}