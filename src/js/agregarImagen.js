import { Dropzone } from "dropzone";

const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

// console.log(token);

Dropzone.options.imagen = {
  dictDefaultMessage: "Arrastra las imagenes aqui",
  acceptedFiles: ".jpeg,.jpg,.png,.gif,.webp,.svg,.avif,.heic,.heif,.tiff",
  maxFilesize: 5,
  maxFiles: 1,
  parallelUploads: 1,
  autoProcessQueue: false,
  addRemoveLinks: true,
  dictRemoveFile: "Borrar archivo",
  dictMaxFilesExceeded: "El limite es de 1 archivo",
  headers: {
    "X-CSRF-TOKEN": token,
  },
  paramName: "imagen",
  init: function () {
    const dropzone = this;
    const btnPublicar = document.querySelector("#publicar");

    btnPublicar.addEventListener("click", function () {
      dropzone.processQueue();
    });

    dropzone.on("queuecomplete", function () {
      if (dropzone.getActiveFiles().length == 0) {
        window.location.href = "/misPropiedades";
      }
    });
  },
};
