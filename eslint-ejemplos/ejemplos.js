/**
 * Archivo de PRUEBA para validar reglas ESLint.
 * NO usar en producción. Ejecutar: npm run lint:demo
 */

// 1. Parámetro definido pero nunca usado
function sumar(a, b, usuario) {
  return a + b;
}

// 2. Función declarada pero nunca llamada
function funcionNuncaLlamada() {
  return 42;
}

function otraSinUsar() {
  return 'hola';
}

// 3. == convierte tipos (usar ===)
function comparar(valor) {
  if (valor == '10') {
    return true;
  }
  if (valor == null) {
    return false;
  }
  return false;
}

// 4. Código inalcanzable (después de return)
function obtenerNombre() {
  return 'Pepito';

  console.log('Esto nunca se ejecuta');
}

module.exports = { sumar };
