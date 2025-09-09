import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  section: {
    backgroundColor: 'transparent',
    paddingTop: 8,
    paddingBottom: 32,
    paddingHorizontal: 16,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  item: {
    padding: 8,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    maxHeight: 70,
    width: 'auto',
    resizeMode: 'contain',
    padding: 5,
    tintColor: '#888',
  },
});
