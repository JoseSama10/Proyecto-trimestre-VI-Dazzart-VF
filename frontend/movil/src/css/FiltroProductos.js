import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // --- Estructura Principal ---
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9', // Un fondo gris claro para un look limpio
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 10,
  },
  breadcrumb: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  // --- Botón de Filtro Profesional ---
  filtrarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    gap: 8, // Espacio entre el ícono y el texto
    // Sombra para darle elevación (Android)
    elevation: 3,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filtrarBtnTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  // --- Cuadrícula de Productos (2 columnas) ---
  productosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Espacio entre las columnas
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productoCol: {
    width: '48%', // Ancho para cada tarjeta, dejando un pequeño espacio en el medio
    marginBottom: 15,
  },
  noProductos: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },

  // --- Estilos para el Modal de Filtros ---
  filtrosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtrosModalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    paddingTop: 40, // Espacio para el botón de cerrar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filtrosModalClose: {
    position: 'absolute',
    top: 10,
    right: 15,
  },
  filtrosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  filtrosRow: {
    width: '100%',
  },
  filtroItem: {
    marginBottom: 20,
  },
  ofertaCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  picker: {
    width: '100%',
    height: 50,
  },
});

export default styles;
