(function () {
  const lat = document.querySelector("#lat").value || 6.2493266;
  const lng = document.querySelector("#lng").value || -75.5679984;
  const mapa = L.map("mapa").setView([lat, lng], 13);
  let marker;

  const geocodeService = L.esri.Geocoding.geocodeService();

  https: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);
  //el pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa);

  //cuando el marker este arrastrado
  marker.on("moveend", function (e) {
    marker = e.target;
    const position = marker.getLatLng();
    mapa.panTo(new L.LatLng(position.lat, position.lng));

    //obtener la inf de las calles al soltar el marker
    geocodeService
      .reverse()
      .latlng(position, 16)
      .run(function (error, result) {
        // console.log(result);
        if (error) {
          return;
        }
        marker.bindPopup(result.address.LongLabel).openPopup();

        //llenar los campos
        document.querySelector(".calle").textContent =
          result?.address?.Address ?? "";
        document.querySelector("#calle").value = result?.address?.Address ?? "";
        document.querySelector("#lat").value = result?.latlng?.lat ?? "";
        document.querySelector("#lng").value = result?.latlng?.lng ?? "";
      });
  });
})();

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      const mapa = L.map("mapa").setView([latitude, longitude], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapa);
    },
    function (error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.error("Permiso denegado para obtener la ubicación.");
          break;
        case error.POSITION_UNAVAILABLE:
          console.error("La información de ubicación no está disponible.");
          break;
        case error.TIMEOUT:
          console.error("La solicitud para obtener la ubicación ha caducado.");
          break;
        case error.UNKNOWN_ERROR:
          console.error("Ha ocurrido un error desconocido.");
          break;
      }
    }
  );
} else {
  console.error("Geolocalización no es soportada por este navegador.");
}
