import ModalLogin from '../../Components/ModalLogin';
import API from '../../config/api';

import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../../css/DetalleProducto';
import ModalFeedback from '../../Components/ModalFeedback';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function DetalleProducto({ usuario }) {
    const route = useRoute();
    const navigation = useNavigation();
    const { producto } = route.params || {};
    const [cantidad, setCantidad] = useState(1);
    const [dropdownCantidadVisible, setDropdownCantidadVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [mensajeModal, setMensajeModal] = useState('');
    const [modalCarrito, setModalCarrito] = useState(false);
    // El usuario viene por props

    if (!producto) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>No se encontró el producto.</Text>
            </View>
        );
    }

    const maxCantidad = producto.stock || 10;

    const [showLogin, setShowLogin] = useState(false);
    const handleAgregarCarrito = async () => {
        if (!usuario) {
            setShowLogin(true);
            return;
        }
        try {
            await API.post('/carrito', {
                id_usuario: usuario.id_usuario,
                id_producto: producto._id || producto.id || producto.id_producto,
                cantidad: cantidad,
            });
            setModalCarrito(true);
        } catch (e) {
            setMensajeModal('Error al agregar al carrito');
            setModalVisible(true);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.volverBtn}>
                <Text style={styles.volverTxt}>← Volver</Text>
            </TouchableOpacity>
            <View style={styles.imgBoxMobile}>
                <Image source={{ uri: producto.urlImagen || producto.imagen }} style={styles.imagenMobile} />
            </View>
            <View style={styles.infoBoxMobile}>
                <Text style={styles.tituloMobile}>{producto.nombre}</Text>
                <View style={styles.precioBoxMobile}>
                    {producto.descuento_aplicado ? (
                        <>
                            <Text style={styles.precioTachadoMobile}>${producto.precio}</Text>
                            <Text style={styles.precioDescuentoMobile}>${producto.precio_final}</Text>
                            {producto.descuento_aplicado.tipo_descuento?.toLowerCase() === 'porcentaje' && (
                                <Text style={styles.badgeMobile}>-{producto.descuento_aplicado.valor}%</Text>
                            )}
                            {(producto.descuento_aplicado.tipo_descuento?.toLowerCase() === 'valor' || producto.descuento_aplicado.tipo_descuento?.toLowerCase() === 'fijo') && (
                                <Text style={styles.badgeMobile}>-${producto.descuento_aplicado.valor}</Text>
                            )}
                        </>
                    ) : (
                        <Text style={styles.precioNormalMobile}>${producto.precio}</Text>
                    )}
                </View>
                <View style={styles.cantidadBoxMobile}>
                    <Text style={styles.cantidadLabelMobile}>Cantidad:</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                        <TouchableOpacity
                            style={[styles.cantidadSelectBtnMobile, { minWidth: 90, paddingHorizontal: 8, paddingVertical: 6 }]}
                            onPress={() => setDropdownCantidadVisible(!dropdownCantidadVisible)}
                            activeOpacity={0.8}
                        >
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                                <Text style={styles.cantidadSelectTxtMobile}>{cantidad} {cantidad === 1 ? 'Producto' : 'Productos'}</Text>
                                <Text style={styles.cantidadArrow}>{dropdownCantidadVisible ? '▲' : '▼'}</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.stockTxtMobile}> {producto.stock} disponibles</Text>
                        {dropdownCantidadVisible && (
                            <>
                                {/* Overlay para cerrar al tocar fuera */}
                                <TouchableOpacity
                                    style={{position: 'absolute', top: 0, left: -1000, right: -1000, bottom: -1000, zIndex: 9}}
                                    activeOpacity={1}
                                    onPress={() => setDropdownCantidadVisible(false)}
                                />
                                <View style={styles.dropdownCantidadBox}>
                                    <ScrollView style={styles.dropdownCantidadScroll}>
                                        {Array.from({ length: maxCantidad }, (_, i) => i + 1).map(num => (
                                            <TouchableOpacity
                                                key={num}
                                                style={[styles.dropdownCantidadBtn, cantidad === num && styles.dropdownCantidadBtnAct]}
                                                onPress={() => {
                                                    setCantidad(num);
                                                    setDropdownCantidadVisible(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownCantidadBtnTxt}>{num} {num === 1 ? 'Producto' : 'Productos'}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </>
                        )}
                    </View>
                </View>
                <View style={styles.btnBoxMobile}>
                    <TouchableOpacity style={styles.btnCarritoMobile} onPress={handleAgregarCarrito}>
                        <Text style={styles.btnCarritoTxtMobile}>+ Añadir al carrito</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnComprarMobile} onPress={() => Alert.alert('Funcionalidad "Comprar ahora" no implementada')}>
                        <Text style={styles.btnComprarTxtMobile}>Comprar ahora</Text>
                    </TouchableOpacity>
                </View>
                        <View style={styles.tabBoxMobile}>
                            <Text style={styles.tabTitleMobile}>Descripción</Text>
                            <Text style={styles.descripcionMobile}>{producto.descripcion}</Text>
                        </View>
                    </View>
            {/* MODAL DE LOGIN solo si no está logueado */}
            <ModalLogin
                visible={showLogin}
                onClose={() => setShowLogin(false)}
                onLogin={user => {
                    setShowLogin(false);
                    // Aquí podrías recargar la pantalla o pasar el usuario al padre
                }}
            />
            {/* MODAL DE PRODUCTO AGREGADO AL CARRITO */}
            <ModalFeedback
                visible={modalCarrito}
                onClose={() => setModalCarrito(false)}
                titulo="Producto agregado"
                mensaje="Cantidad actualizada en el carrito"
                textoBoton="Cerrar"
                textoBotonSecundario="Ir al carrito"
                onBotonSecundario={() => {
                    setModalCarrito(false);
                    navigation.navigate('Carrito');
                }}
            />
            {/* FOOTER SIMULADO*/}
            <View style={{ height: 60 }} />
        </ScrollView>
    );
}