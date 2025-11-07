const map = L.map("map", {
    dragging: false,
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    touchZoom: false
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let geoLayer;
let districts;
let currentHighlight = null;
const resultElement = document.getElementById("result")

fetch("./georef-portugal-distrito.geojson")
    .then(res => res.json())
    .then(data => {
        districts = data.features;

        geoLayer = L.geoJSON(data, {
            style: {
                color: "black",
                weight: 1,
                fillOpacity: 0.2,
            }
        }).addTo(map);

        // Automatically zoom and fit all districts (mainland + islands)
        map.fitBounds(geoLayer.getBounds());
    });

function randomHighlightAnimation() {
    if (!districts) return;

    let cycles = 20;

    const interval = setInterval(() => {
        let randomFeature = districts[Math.floor(Math.random() * districts.length)];

        // Remove the previous highlight
        if (currentHighlight) geoLayer.resetStyle(currentHighlight);

        // Apply new temporary highlight
        currentHighlight = geoLayer.getLayers().find(
            layer => layer.feature.properties.dis_code === randomFeature.properties.dis_code
        );

        currentHighlight.setStyle({
            color: "orange",
            weight: 3,
            fillOpacity: 0.6
        });

        cycles--;
        if (cycles === 0) {
            clearInterval(interval);

            // Final highlight (red)
            currentHighlight.setStyle({
                color: "green",
                weight: 4,
                fillOpacity: 0.7
            });

            resultElement.textContent = randomFeature.properties.dis_name
        }
    }, 150);
}

document.getElementById("spin-btn").addEventListener("click", randomHighlightAnimation);
