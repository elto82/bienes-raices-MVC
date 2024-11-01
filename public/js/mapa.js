/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  const lat = document.querySelector(\"#lat\").value || 6.2493266;\r\n  const lng = document.querySelector(\"#lng\").value || -75.5679984;\r\n  const mapa = L.map(\"mapa\").setView([lat, lng], 13);\r\n  let marker;\r\n\r\n  const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n  https: L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n  //el pin\r\n  marker = new L.marker([lat, lng], {\r\n    draggable: true,\r\n    autoPan: true,\r\n  }).addTo(mapa);\r\n\r\n  //cuando el marker este arrastrado\r\n  marker.on(\"moveend\", function (e) {\r\n    marker = e.target;\r\n    const position = marker.getLatLng();\r\n    mapa.panTo(new L.LatLng(position.lat, position.lng));\r\n\r\n    //obtener la inf de las calles al soltar el marker\r\n    geocodeService\r\n      .reverse()\r\n      .latlng(position, 16)\r\n      .run(function (error, result) {\r\n        // console.log(result);\r\n        if (error) {\r\n          return;\r\n        }\r\n        marker.bindPopup(result.address.LongLabel).openPopup();\r\n\r\n        //llenar los campos\r\n        document.querySelector(\".calle\").textContent =\r\n          result?.address?.Address ?? \"\";\r\n        document.querySelector(\"#calle\").value = result?.address?.Address ?? \"\";\r\n        document.querySelector(\"#lat\").value = result?.latlng?.lat ?? \"\";\r\n        document.querySelector(\"#lng\").value = result?.latlng?.lng ?? \"\";\r\n      });\r\n  });\r\n})();\r\n\r\nif (navigator.geolocation) {\r\n  navigator.geolocation.getCurrentPosition(\r\n    async function (position) {\r\n      latitude = position.coords.latitude;\r\n      longitude = position.coords.longitude;\r\n\r\n      const mapa = L.map(\"mapa\").setView([latitude, longitude], 16);\r\n\r\n      L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n        attribution:\r\n          '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n      }).addTo(mapa);\r\n    },\r\n    function (error) {\r\n      switch (error.code) {\r\n        case error.PERMISSION_DENIED:\r\n          console.error(\"Permiso denegado para obtener la ubicación.\");\r\n          break;\r\n        case error.POSITION_UNAVAILABLE:\r\n          console.error(\"La información de ubicación no está disponible.\");\r\n          break;\r\n        case error.TIMEOUT:\r\n          console.error(\"La solicitud para obtener la ubicación ha caducado.\");\r\n          break;\r\n        case error.UNKNOWN_ERROR:\r\n          console.error(\"Ha ocurrido un error desconocido.\");\r\n          break;\r\n      }\r\n    }\r\n  );\r\n} else {\r\n  console.error(\"Geolocalización no es soportada por este navegador.\");\r\n}\r\n\n\n//# sourceURL=webpack://bienes-raices-mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;