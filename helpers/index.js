const esVendedor = (usuarioId, propiedadUsuarioId) => {
  return usuarioId === propiedadUsuarioId;
};

const formatearFecha = (fecha) => {
  const nuevaFecha = new Date(fecha).toISOString().slice(0, 10);
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  return new Date(nuevaFecha).toLocaleDateString("es-ES", opciones);
};

export { esVendedor, formatearFecha };
