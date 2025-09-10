import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#f5f6fa', 
    borderRadius: 14,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e1e1e1', 
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#23272f', 
    letterSpacing: 0.5,
  },
  cardEstado: {
    backgroundColor: '#e1e1e1',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 3,
    color: '#23272f', 
    fontWeight: 'bold',
    fontSize: 15,
    overflow: 'hidden',
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardBtn: {
    backgroundColor: '#e1e1e1',
    borderRadius: 7,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  cardBtnText: {
    color: '#23272f', 
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
