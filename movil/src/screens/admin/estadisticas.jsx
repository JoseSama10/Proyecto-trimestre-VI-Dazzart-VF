import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import API from "../../config/api";
import MenuLateral from "../../Components/Admin/MenuLateral";

export default function EstadisticasAdmin() {
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    totalPedidos: 0,
    totalClientes: 0,
    totalProductos: 0,
    productosMasVendidos: [],
    productosMenosVendidos: [],
    stockTotal: 0
  });
  const [mostrarStock, setMostrarStock] = useState(false);
  const [mostrarMenosVendidos, setMostrarMenosVendidos] = useState(false); 
  const [productos, setProductos] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const [productosRes, pedidosRes] = await Promise.all([
          API.get("/productos/listar"),
          API.get("/pedidos"),
        ]);

        const productos = productosRes.data;
        setProductos(productos);

        const pedidos = pedidosRes.data;
        const pedidosValidos = pedidos.filter(p => p.estado !== 'cancelado');
        const totalVentas = pedidosValidos.reduce((acc, p) => acc + Number(p.total || 0), 0);
        const totalPedidos = pedidos.length;
        const clientesUnicos = new Set(pedidos.map(p => p.nombre_cliente)).size;

        // CALCULAR PRODUCTOS MENOS VENDIDOS Y MAS VENDIDOS
        const productosVendidos = {};
        pedidosValidos.forEach(p => {
          if (!p.productos) return;
          let productosArray = Array.isArray(p.productos) ? p.productos : [];
          productosArray.forEach(prod => {
            const id = String(prod.id_producto || prod.id || prod._id);
            const nombre = prod.nombre?.trim() || 'Desconocido';
            const cantidad = Number(prod.cantidad) || 0;
            if (!productosVendidos[id]) {
              productosVendidos[id] = { nombre, vendidos: 0 };
            }
            productosVendidos[id].vendidos += cantidad;
          });
        });

        const todosProductos = productos.map(p => {
          const idStr = String(p.id_producto);
          const vendido = productosVendidos[idStr];
          return {
            id_producto: p.id_producto,
            nombre: p.nombre,
            vendidos: vendido ? vendido.vendidos : 0
          };
        });

        // PRODUCTOS NUNCA VENDIDOS
        const productosNuncaVendidos = todosProductos.filter(p => p.vendidos === 0);

        // MENOS VENDIDOS: PRIMERO LOS NUNCA VENDIDOS, SI NO HAY, LOS CON MENOS VENTAS
        const productosMenosVendidos = productosNuncaVendidos.length > 0
          ? productosNuncaVendidos
          : todosProductos.sort((a, b) => a.vendidos - b.vendidos).slice(0, 5);

        // MAS VENDIDOS 
        const productosMasVendidos = todosProductos
          .filter(p => p.vendidos > 0)
          .sort((a, b) => b.vendidos - a.vendidos)
          .slice(0, 5);

        setEstadisticas({
          totalVentas,
          totalPedidos,
          totalClientes: clientesUnicos,
          totalProductos: productos.reduce((acc, p) => acc + Number(p.stock || 0), 0),
          productosMasVendidos,
          productosMenosVendidos,
          stockTotal: productos.reduce((acc, p) => acc + Number(p.stock || 0), 0)
        });
      } catch (_error) {
      }
    };

    cargarEstadisticas();
  }, []);

  const formatoDinero = (num) => {
    return num.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <Icon name="bars" size={28} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadísticas del eCommerce</Text>
      </View>

      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <MenuLateral />
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#007bff" }]}>
            <Icon name="money-bill-wave" size={28} color="#fff" style={styles.statIcon} />
            <Text style={styles.statLabel}>Total Ganancias</Text>
            <Text style={styles.statValue}>{formatoDinero(estadisticas.totalVentas)}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#28a745" }]}>
            <Icon name="shopping-cart" size={28} color="#fff" style={styles.statIcon} />
            <Text style={styles.statLabel}>Total Pedidos</Text>
            <Text style={styles.statValue}>{estadisticas.totalPedidos}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: "#17a2b8" }]}>
            <Icon name="users" size={28} color="#fff" style={styles.statIcon} />
            <Text style={styles.statLabel}>Total Clientes</Text>
            <Text style={styles.statValue}>{estadisticas.totalClientes}</Text>
          </View>
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: "#ffc107" }]}
            onPress={() => setMostrarStock(true)}
            activeOpacity={0.8}
          >
            <Icon name="box-open" size={28} color="#333" style={styles.statIcon} />
            <Text style={[styles.statLabel, { color: "#333" }]}>Stock total disponible</Text>
            <Text style={[styles.statValue, { color: "#333" }]}>{estadisticas.totalProductos}</Text>
          </TouchableOpacity>

          
          {/* CARD DE PRODUCTOS MENOS VENDIDOS */}
          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: "#AC0818FF" }]}
            onPress={() => setMostrarMenosVendidos(true)}
            activeOpacity={0.8}
          >
            <Icon name="exclamation-circle" size={28} color="#FFF" style={styles.statIcon} />
            <Text style={styles.statLabel}>Productos Menos Vendidos</Text>

          </TouchableOpacity>
        </View>

        {/* MODAL DE STOCK DE PRODUCTOS */}
        <Modal visible={mostrarStock} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setMostrarStock(false)}
                style={styles.closeBtn}
              >
                <Text style={{ fontSize: 24, color: "#888" }}>&times;</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Stock por producto</Text>
              <FlatList
                data={productos}
                keyExtractor={item => item.id_producto?.toString() || item.nombre + Math.random()}
                style={{ marginTop: 10 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListHeaderComponent={
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, { flex: 2, fontWeight: "bold" }]}>Producto</Text>
                    <Text style={[styles.tableCell, { flex: 1, fontWeight: "bold" }]}>Stock</Text>
                    <Text style={[styles.tableCell, { flex: 1, fontWeight: "bold" }]}>Precio</Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{item.nombre}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{item.stock}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{formatoDinero(item.precio_final ?? item.precio)}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        </Modal>

        <Text style={styles.subtitle}>
          <Icon name="star" size={20} color="#ffc107" /> Productos Mas Vendidos
        </Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { flex: 2, fontWeight: "bold" }]}>Producto</Text>
          <Text style={[styles.tableCell, { flex: 1, fontWeight: "bold" }]}>Unidades Vendidas</Text>
        </View>
        {estadisticas.productosMasVendidos.map((prod, idx) => (
          <View style={styles.tableRow} key={prod.id_producto || prod.nombre + idx}>
            <Text style={[styles.tableCell, { flex: 2 }]}>{prod.nombre}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{prod.vendidos}</Text>
          </View>
        ))}

        {/* Modal de productos menos vendidos */}
        <Modal visible={mostrarMenosVendidos} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => setMostrarMenosVendidos(false)}
                style={styles.closeBtn}
              >
                <Text style={{ fontSize: 24, color: "#888" }}>&times;</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Productos Menos Vendidos</Text>
              <FlatList
                data={estadisticas.productosMenosVendidos}
                keyExtractor={item => item.nombre}
                style={{ marginTop: 10 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListHeaderComponent={
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, { flex: 2, fontWeight: "bold" }]}>Productos</Text>
                    <Text style={[styles.tableCell, { flex: 1, fontWeight: "bold" }]}>Unidades Vendidas</Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{item.nombre}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{item.vendidos}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 8,
  },
  menuButton: {
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 6,
    elevation: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#212529",
    flex: 1,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
  },
  menuContainer: {
    width: 240,
    backgroundColor: "#212529",
    height: "100%",
    paddingTop: 0,
  },
  container: {
    padding: 18,
    backgroundColor: "#f8f9fa",
    minHeight: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#212529",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 10,
    color: "#212529",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 2,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  statIcon: {
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 15,
    marginBottom: 4,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 22,
    minWidth: 320,
    maxWidth: 500,
    width: "90%",
    maxHeight: "80%",
    elevation: 6,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#212529",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 6,
    marginBottom: 4,
    marginTop: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    paddingVertical: 7,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 15,
    color: "#212529",
    paddingHorizontal: 4,
    textAlign: "left",
  },
});