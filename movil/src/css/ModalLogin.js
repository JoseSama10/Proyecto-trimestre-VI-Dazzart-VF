import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.18)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: '85%',
		backgroundColor: '#fff',
		borderRadius: 22,
		padding: 28,
		alignItems: 'center',
		elevation: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.18,
		shadowRadius: 8,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 22,
		color: '#222',
		textAlign: 'center',
	},
	inputGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 8,
		backgroundColor: '#f8f9fa',
		marginBottom: 16,
		paddingHorizontal: 8,
	},
	iconInput: {
		marginRight: 8,
		color: '#222',
	},
	input: {
		flex: 1,
		height: 44,
		fontSize: 17,
		color: '#222',
		backgroundColor: 'transparent',
	},
	button: {
		backgroundColor: '#111',
		borderRadius: 10,
		paddingVertical: 13,
		paddingHorizontal: 0,
		width: '100%',
		marginTop: 8,
		marginBottom: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 18,
		marginLeft: 8,
	},
	error: {
		color: 'red',
		marginBottom: 8,
		fontSize: 15,
		textAlign: 'center',
	},
	closeBtn: {
		position: 'absolute',
		top: 14,
		right: 14,
		padding: 4,
	},
	linksRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginTop: 10,
	},
	link: {
		color: '#1976d2',
		fontSize: 15,
		textDecorationLine: 'underline',
	},
});

export default styles;
