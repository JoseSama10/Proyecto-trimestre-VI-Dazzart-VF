import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  breadcrumb: {
    fontWeight: 'bold',
    fontSize: 22,
    margin: 16,
    textAlign: 'center',
    color: '#1976d2',
  },
  filtrarBtn: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 2,
  },
  filtrarBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  filtrosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtrosModalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    width: '90%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    position: 'relative',
  },
  filtrosModalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  filtrosTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#1976d2',
    letterSpacing: 0.5,
  },
  filtrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 10,
  },
  filtroItem: {
    flex: 1,
    minWidth: 120,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  ofertaCheck: {
    minWidth: 180,
    padding: 8,
  },
  pickerWrapper: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginLeft: 8,
    minWidth: 140,
    overflow: 'hidden',
  },
  picker: {
    height: 38,
    width: '100%',
    color: '#222',
    fontSize: 16,
  },
  selectLabel: {
    fontWeight: '600',
    marginRight: 6,
  },
  noProductos: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  productosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    padding: 8,
  },
  productoCol: {
    width: '45%',
    margin: 8,
  },
});

export default styles;
