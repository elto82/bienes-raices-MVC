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

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  const lat = 6.2493266;\r\n  const lng = -75.5679984;\r\n  const mapa = L.map(\"mapa\").setView([lat, lng], 13);\r\n\r\n  //6.2493266,-75.5679984,3a,75y,322.45h,75.2t/\r\n\r\n  https: L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(mapa);\r\n})();\r\n\r\nif (navigator.geolocation) {\r\n  navigator.geolocation.getCurrentPosition(\r\n    async function (position) {\r\n      latitude = position.coords.latitude;\r\n      longitude = position.coords.longitude;\r\n\r\n      const mapa = L.map(\"mapa\").setView([latitude, longitude], 16);\r\n\r\n      L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n        attribution:\r\n          '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n      }).addTo(mapa);\r\n    },\r\n    function (error) {\r\n      switch (error.code) {\r\n        case error.PERMISSION_DENIED:\r\n          console.error(\"Permiso denegado para obtener la ubicación.\");\r\n          break;\r\n        case error.POSITION_UNAVAILABLE:\r\n          console.error(\"La información de ubicación no está disponible.\");\r\n          break;\r\n        case error.TIMEOUT:\r\n          console.error(\"La solicitud para obtener la ubicación ha caducado.\");\r\n          break;\r\n        case error.UNKNOWN_ERROR:\r\n          console.error(\"Ha ocurrido un error desconocido.\");\r\n          break;\r\n      }\r\n    }\r\n  );\r\n} else {\r\n  console.error(\"Geolocalización no es soportada por este navegador.\");\r\n}\r\n\n\n//# sourceURL=webpack://bienes-raices-mvc/./src/js/mapa.js?");

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