   import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    volverBtn: { marginTop: 35, marginLeft: 8 },
    volverTxt: { fontSize: 18, color: '#3483fa', fontWeight: 'bold' },

    productBoxMobile: {
        padding: 12,
        gap: 12,
        alignItems: 'center', 
    },

    imgBoxMobile: { alignItems: 'center', marginTop: 10 },
    imagenDetalle: {
        width: 340,
        height: 260,
        borderRadius: 16,
        backgroundColor: '#fff',
        marginBottom: 10,
    },

    infoBoxMobile: { flex: 1, paddingHorizontal: 18, paddingBottom: 18 },
    tituloMobile: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#222', textAlign: 'center' },

    precioBoxMobile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, gap: 8 },
    precioTachadoMobile: { fontSize: 18, color: '#888', textDecorationLine: 'line-through', marginRight: 8 },
    precioDescuentoMobile: { fontSize: 24, color: '#3483fa', fontWeight: 'bold', marginRight: 8 },
    badgeMobile: { backgroundColor: '#43a047', color: '#fff', fontWeight: 'bold', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, fontSize: 14 },
    precioNormalMobile: { fontSize: 24, color: '#3483fa', fontWeight: 'bold' },

    cantidadBoxMobile: { marginBottom: 12, alignItems: 'center' },
    cantidadLabelMobile: { fontWeight: 'bold', fontSize: 16, marginBottom: 4 },

    cantidadSelectBtnMobile: {
        borderWidth: 1,
        borderColor: '#d1d5db', 
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#fff',
        minWidth: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        shadowColor: '#eee',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 2,
        elevation: 1,
    },
    cantidadSelectTxtMobile: { fontSize: 16, color: '#222', textAlign: 'center', fontWeight: '500' },

    modalCantidadOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
    modalCantidadBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        minWidth: 220,
        maxHeight: 320,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    modalCantidadScroll: { marginBottom: 8 },
    modalCantidadBtn: { paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'flex-start' },
    modalCantidadBtnAct: { backgroundColor: '#e3f0ff' },
    modalCantidadBtnTxt: { fontSize: 16, color: '#222' },
    modalCantidadCloseBtn: { alignSelf: 'flex-end', padding: 6 },
    modalCantidadCloseTxt: { color: '#3483fa', fontWeight: 'bold', fontSize: 15 },

    stockTxtMobile: { fontSize: 14, color: '#888', marginTop: 2 },

    btnBoxMobile: { flexDirection: 'row', gap: 12, marginBottom: 18, justifyContent: 'center' },
    btnCarritoMobile: { backgroundColor: '#3483fa', borderRadius: 8, padding: 12, flex: 1, alignItems: 'center' },
    btnCarritoTxtMobile: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    btnComprarMobile: { borderColor: '#3483fa', borderWidth: 2, borderRadius: 8, padding: 12, flex: 1, alignItems: 'center' },
    btnComprarTxtMobile: { color: '#3483fa', fontWeight: 'bold', fontSize: 16 },

    tabBoxMobile: { marginHorizontal: 16, marginTop: 18, backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#eee' },
    tabTitleMobile: { fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
    descripcionMobile: { fontSize: 15, color: '#444' },

    error: { fontSize: 18, color: 'red', textAlign: 'center', marginTop: 40 },

    cantidadArrow: {
        fontSize: 18,
        color: '#444',
        marginLeft: 8,
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -9 }],
    },

    dropdownCantidadBox: {
        position: 'absolute',
        top: 48,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#bdbdbd',
        borderRadius: 6,
        zIndex: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        maxHeight: 220,
    },
    dropdownCantidadScroll: { paddingVertical: 4 },
    dropdownCantidadBtn: { paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'flex-start' },
    dropdownCantidadBtnAct: { backgroundColor: '#e3f0ff' },
    dropdownCantidadBtnTxt: { fontSize: 16, color: '#222' },
});
