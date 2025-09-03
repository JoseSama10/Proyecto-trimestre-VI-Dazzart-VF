import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 70,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 48,
    resizeMode: 'contain',
    marginRight: 16,
  },
  menuIcon: {
    marginLeft: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 16,
    width: 260,
    maxWidth: '70%',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    marginHorizontal: 10,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});
