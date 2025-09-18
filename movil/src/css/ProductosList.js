import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    marginBottom: 18,
    width: 210,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    alignItems: 'center',
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: '100%',
    height: 170,
    resizeMode: 'contain',
    borderRadius: 0,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    marginTop: 0,
    marginBottom: 0,
  },
  noImage: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 0,
    alignSelf: 'center',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16, // Tamaño más adecuado para la cuadrícula
    textAlign: 'center',
    marginBottom: 10,
    color: '#222',
    minHeight: 40, // Asegura espacio para 2 líneas de texto
  },
  descripcion: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  precioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  precioTachado: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 18,
    marginRight: 8,
  },
  precioDescuento: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 20,
    marginLeft: 4,
  },
  precioNormal: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginTop: 8,
    textAlign: 'center',
  },
  iconBtn: {
    marginHorizontal: 4,
    padding: 2,
  },
});

export default styles;
