// ESTILOS PARA EL MODAL DE FEEDBACK REUTILIZABLE (COMO PRODUCTO AGREGADO, ERROR, ETC.)
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // FONDO SEMINTRASPARENTE PARA OSCURECER EL FONDO
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // CONTENEDOR PRINCIPAL DEL MODAL (CAJA BLANCA CENTRADA)
  modalContainer: {
    width: '92%',
    maxWidth: 420,
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: 'center',
    elevation: 12,
    position: 'relative',
    backgroundColor: '#fff', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  // BOTON X DE CERRAR (ESQUINA SUPERIOR DERECHA)
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 2,
    padding: 4,
  },
  // ICONO DE CHECK AZUL
  iconCheck: {
    marginBottom: 16,
    marginTop: 8,
    alignSelf: 'center',
  },
  // TITULO PRINCIPAL (PRODUCTO AGREGADO")
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 2,
    textAlign: 'center',
    color: '#222',
  },
  // MENSAJE SECUNDARIO (PRODUCTO AGREGADO AL CARRITO")
  subtitle: {
    fontSize: 17,
    marginBottom: 28,
    textAlign: 'center',
    color: '#444', 
  },
  // FILA DE BOTONES (CERRAR E IR AL CARRITO)
  buttonRowVite: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 18,
    gap: 14,
  },
  // ESTILOS COMUNES PARA AMBOS BOTONES
  btnVite: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 2,
    minWidth: 0,
  },
  // BOTON "CERRAR" 
  btnViteOutline: {
    borderWidth: 2,
    borderColor: '#0084ff',
    backgroundColor: '#fff',
  },
  btnViteOutlineText: {
    color: '#0084ff',
    fontWeight: 'bold',
    fontSize: 19,
  },
  // BOTON "IR AL CARRITO"
  btnViteSolid: {
    backgroundColor: '#111',
  },
  btnViteSolidText: { 
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
  },
});

export default styles;
