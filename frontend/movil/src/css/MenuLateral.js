import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 100,
    flexDirection: 'row',
  },
  drawerContainer: {
    width: 290,
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: 32,
    paddingHorizontal: 18,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
    marginTop: 12,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  categoriaBtn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
  },
  categoriaText: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
  },
  subcategoriaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: '#f8f8f8',
  },
  subcategoriaText: {
    fontSize: 16,
    color: '#444',
  },
  sinSubcategorias: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    color: '#1976d2',
    marginLeft: 6,
    fontWeight: 'bold',
  },
});

export default styles;
