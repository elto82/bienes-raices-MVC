(function () {
  const lat = 6.2493266;
  const lng = -75.5679984;
  const mapa = L.map("mapa-inicio").setView([lat, lng], 13);

  https: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa);
})();
