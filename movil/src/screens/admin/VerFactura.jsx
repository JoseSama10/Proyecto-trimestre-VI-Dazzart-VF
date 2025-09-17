
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import API from "../../config/api";
import MenuLateral from "../../Components/Admin/MenuLateral";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from '@react-native-picker/picker';


export default function VerFacturaAdmin() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const [factura, setFactura] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const estadosDisponibles = ["en proceso", "en camino", "entregado"];

  const cargarFactura = () => {
    if (!id) return;
    API.get(`/pedidos/${id}`)
      .then(res => {
        setFactura(res.data);
        setNuevoEstado("");
      })
      .catch(() => setFactura(null));
  };

  useEffect(() => {
    cargarFactura();
  }, [id]);

  const guardarCambioEstado = async () => {
    if (!nuevoEstado || nuevoEstado === factura.estado) {
      Alert.alert("Sin cambios", "No has realizado ningún cambio en el estado");
      return;
    }
    try {
      await API.put(`/pedidos/actualizar-estado/${id}`, { nuevo_estado: nuevoEstado });
      cargarFactura();
      Alert.alert("Éxito", "Estado actualizado con éxito");
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar el estado del pedido");
    }
  };

  if (!factura) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se pudo cargar la factura</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Icon name="bars" size={28} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle Pedido</Text>
      </View>
      <Modal visible={showMenu} transparent animationType="slide" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <MenuLateral />
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Detalle Pedido</Text>
          <Text style={styles.label}>ID: <Text style={styles.value}>{factura.id_factura}</Text></Text>
          <Text style={styles.label}>Nombre: <Text style={styles.value}>{factura.nombre_cliente}</Text></Text>
          <Text style={styles.label}>Dirección: <Text style={styles.value}>{factura.direccion}</Text></Text>
          <Text style={styles.label}>Productos:</Text>
          {Array.isArray(factura.productos) && factura.productos.length > 0 ? (
            factura.productos.map((prod, idx) => (
              <Text key={idx} style={styles.value}>
                {prod.nombre} (x{prod.cantidad}) - ${Number(prod.precio_final ?? prod.precio ?? 0).toLocaleString("es-CO")}
              </Text>
            ))
          ) : (
            <Text style={styles.value}>Sin productos</Text>
          )}
          <Text style={styles.label}>Cantidad: <Text style={styles.value}>{factura.total_productos}</Text></Text>
          <Text style={styles.label}>Total: <Text style={styles.value}>${Number(factura.total).toLocaleString("es-CO")}</Text></Text>
          <Text style={styles.label}>Estado:</Text>
          {(factura.estado === "cancelado" || factura.estado === "entregado") ? (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.value, { color: factura.estado === "entregado" ? "green" : "red", fontWeight: "bold" }]}>{factura.estado}</Text>
            </View>
          ) : (
            <>
              <Picker
                selectedValue={nuevoEstado}
                style={{ height: 50, width: "100%" }}
                onValueChange={(itemValue) => setNuevoEstado(itemValue)}
              >
                <Picker.Item label="-- Selecciona un estado --" value="" />
                {estadosDisponibles.map((estado) => (
                  <Picker.Item key={estado} label={estado} value={estado} />
                ))}
              </Picker>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: !nuevoEstado || nuevoEstado === factura.estado ? '#ccc' : '#007bff' }]}
                onPress={guardarCambioEstado}
                disabled={!nuevoEstado || nuevoEstado === factura.estado}
              >
                <Text style={styles.saveButtonText}>Guardar estado</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    elevation: 2,
  },
  menuButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
  },
  value: {
    fontWeight: "normal",
    color: "#333",
  },
  saveButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#343a40",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
  },
  menuContainer: {
    width: 250,
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 40,
  },
});
