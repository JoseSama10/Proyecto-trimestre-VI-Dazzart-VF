import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  footer: {
    backgroundColor: '#111',
    paddingVertical: 24,
    paddingHorizontal: 0,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
    width: '100%',
  },
  text: {
    color: '#eee',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Segoe UI',
    marginBottom: 8,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  legalLink: {
    color: '#aaa',
    marginHorizontal: 12,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
