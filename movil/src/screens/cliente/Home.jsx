import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import api from "../../config/api";
import MenuLateral from "../../Components/cliente/MenuLateral";
import ProductoCard from "../../Components/cliente/ProductoCard";
import Icon from "react-native-vector-icons/FontAwesome6";

const IMG_URL = "http://localhost:3001/productos/img"; // Cambia por tu IP si usas dispositivo físico

export default function HomeScreen({ navigation }) {
  const [showMenu, setShowMenu] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cicloInfinito, setCicloInfinito] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalLupaOpen, setModalLupaOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const flatListRef = useRef(null);

  useEffect(() => {
    api
      .get("/productos/listar")
      .then((res) => {
        const data = res.data;
        if (!Array.isArray(data)) {
          Alert.alert("Error", "La respuesta no es un array");
          return;
        }
        const ordenados = [...data].sort(
          (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
        const top10 = ordenados.slice(0, 10);
        setProductos(top10);
        setCicloInfinito([...top10, ...top10]);
      })
      .catch((err) => {
        Alert.alert("Error", "No se pudieron cargar los productos");
      });
  }, []);

  useEffect(() => {
    // Simula usuario guardado
    // AsyncStorage.getItem("usuario").then(u => u && setUsuario(JSON.parse(u)));
  }, []);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    if (!usuario || usuario.id_rol !== 2) {
      setMostrarLogin(true);
      return;
    }
    api
      .post("/carrito", {
        id_usuario: usuario.id_usuario,
        id_producto: producto.id_producto,
        cantidad,
      })
      .then((res) => {
        setModalMensaje(res.data.message || "Producto agregado al carrito");
        setMostrarModal(true);
      })
      .catch((err) => {
        setModalMensaje("Error al agregar al carrito");
        setMostrarModal(true);
      });
  };

  const abrirModalLupa = (producto) => {
    const nombreImg = producto.imagen?.replace(/^\/?.*img\//, "") || "";
    const urlImagen = nombreImg
      ? `${IMG_URL}/${encodeURIComponent(nombreImg)}?t=${Date.now()}`
      : "/default.png";
    setProductoSeleccionado({ ...producto, urlImagen });
    setModalLupaOpen(true);
  };

  const cerrarModalLupa = () => {
    setModalLupaOpen(false);
    setProductoSeleccionado(null);
  };

  const scrollLeft = () => {
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  const scrollRight = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleLogout = () => {
    setUsuario(null);
    // AsyncStorage.removeItem("usuario");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Icon name="bars" size={28} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dazzart</Text>
        {/* Aquí puedes poner un botón de carrito o login */}
      </View>

      {/* Menú lateral como modal */}
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

      {/* Carrusel (placeholder) */}
      <View style={{ height: 180, backgroundColor: "#eee", margin: 16, borderRadius: 12, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#888" }}>[Carrusel aquí]</Text>
      </View>

      <Text style={styles.sectionTitle}>Nuevos Productos</Text>

      {/* Botones de scroll y lista horizontal */}
      <View style={styles.scrollRow}>
        <TouchableOpacity style={styles.scrollBtn} onPress={scrollLeft}>
          <Icon name="chevron-left" size={22} color="#212529" />
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={cicloInfinito}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, idx) => `${item.id_producto}-${idx}`}
          renderItem={({ item }) => {
            const nombreImg = item.imagen?.replace(/^\/?.*img\//, "") || "";
            const urlImagen = nombreImg
              ? `${IMG_URL}/${encodeURIComponent(nombreImg)}?t=${Date.now()}`
              : "/default.png";
            return (
              <View style={styles.productoItem}>
                <ProductoCard
                  producto={{ ...item, urlImagen }}
                  onAgregarCarrito={agregarAlCarrito}
                  onVerDetalle={() => abrirModalLupa(item)}
                  usuario={usuario}
                  onOpenLogin={() => setMostrarLogin(true)}
                />
              </View>
            );
          }}
        />
        <TouchableOpacity style={styles.scrollBtn} onPress={scrollRight}>
          <Icon name="chevron-right" size={22} color="#212529" />
        </TouchableOpacity>
      </View>

      {/* Marcas (placeholder) */}
      <View style={{ margin: 16, backgroundColor: "#fff", borderRadius: 12, padding: 20, alignItems: "center" }}>
        <Text style={{ color: "#888" }}>[Marcas aquí]</Text>
      </View>

      {/* Footer (placeholder) */}
      <View style={{ backgroundColor: "#212529", padding: 20, alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>[Footer aquí]</Text>
      </View>

      {/* Modal Confirmación */}
      <Modal visible={mostrarModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalMensaje}</Text>
            <TouchableOpacity style={styles.saveButton} onPress={() => setMostrarModal(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Producto */}
      <Modal visible={modalLupaOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalle del Producto</Text>
            {/* Aquí puedes mostrar los detalles e imagen */}
            <Text>{productoSeleccionado?.nombre}</Text>
            <TouchableOpacity style={styles.saveButton} onPress={cerrarModalLupa}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Login (placeholder) */}
      <Modal visible={mostrarLogin} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Iniciar Sesión</Text>
            {/* Aquí pon tu formulario de login */}
            <TouchableOpacity style={styles.saveButton} onPress={() => setMostrarLogin(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 8,
  },
  scrollBtn: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 8,
    elevation: 2,
    marginHorizontal: 2,
  },
  productoItem: {
    minWidth: 220,
    maxWidth: 320,
    marginHorizontal: 8,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#0d6efd",
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});