(function () {
  const lat = 6.2493266;
  const lng = -75.5679984;
  const mapa = L.map("mapa").setView([lat, lng], 13);

  //6.2493266,-75.5679984,3a,75y,322.45h,75.2t/

  https: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);
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
