import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import API from "../../config/api"; // tu instancia axios con baseURL
import MenuLateral from "../../Components/Admin/MenuLateral";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function EditarUsuario() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // viene de navigation.navigate("EditarUsuario", { id: ... })

  const [formData, setFormData] = useState({
    nombre: "",
    nombre_usuario: "",
    correo: "",
    telefono: "",
    direccion: "",
    contrasena: "",
    rol: "",
  });

  const [showMenu, setShowMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await API.get(`/usuarios/usuario/${id}`);
        setFormData({
          nombre: res.data.nombre,
          nombre_usuario: res.data.nombre_usuario,
          correo: res.data.correo_electronico,
          telefono: res.data.telefono,
          direccion: res.data.direccion,
          contrasena: "",
          rol: res.data.rol,
        });
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        Alert.alert("Error", "No se pudo cargar la información del usuario");
      }
    };

    cargarUsuario();
  }, [id]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await API.put(`/usuarios/${id}`, formData);
      if (res.status === 200) {
        Alert.alert("Éxito", "El usuario ha sido actualizado con éxito", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error("Error al actualizar:", err);
      Alert.alert("Error", "No se pudo actualizar el usuario");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f0f2f5" }}>
      {/* Barra superior */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Icon name="bars" size={28} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Actualizar Usuario</Text>
      </View>

      {/* Menú lateral */}
      <Modal visible={showMenu} transparent animationType="slide" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <MenuLateral />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Formulario */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre}
            onChangeText={(val) => handleChange("nombre", val)}
            placeholder="Nombre"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de usuario</Text>
          <TextInput
            style={styles.input}
            value={formData.nombre_usuario}
            onChangeText={(val) => handleChange("nombre_usuario", val)}
            placeholder="Usuario"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={formData.correo}
            onChangeText={(val) => handleChange("correo", val)}
            placeholder="Correo"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Celular</Text>
          <TextInput
            style={styles.input}
            value={formData.telefono}
            onChangeText={(val) => handleChange("telefono", val)}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={formData.direccion}
            onChangeText={(val) => handleChange("direccion", val)}
            placeholder="Dirección"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nueva contraseña (opcional)</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={formData.contrasena}
              onChangeText={(val) => handleChange("contrasena", val)}
              placeholder="Déjalo vacío para no cambiarla"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ marginLeft: 8 }}>
              <Icon name={showPassword ? "eye-slash" : "eye"} size={22} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Rol</Text>
          <TextInput style={styles.input} value={formData.rol} editable={false} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            <Icon name="pen" size={16} color="#fff" /> Actualizar
          </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 8,
  },
  menuButton: { marginRight: 16, backgroundColor: "#fff", borderRadius: 30, padding: 6 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#212529", flex: 1 },
  menuOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)", flexDirection: "row" },
  menuContainer: { width: 240, backgroundColor: "#212529", height: "100%" },

  formContainer: { padding: 16 },
  inputGroup: { marginBottom: 14 },
  label: { fontWeight: "bold", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  submitButton: {
    backgroundColor: "#212529",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
});