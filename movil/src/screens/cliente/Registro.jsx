import React, { useState } from "react";
import { Modal } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import API from "../../config/api"; 

const RegistroDazzart = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    cedula: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const validate = () => {
    let valid = true;
    let newErrors = {};

    // Nombre: obligatorio, solo letras y espacios
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      valid = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios";
      valid = false;
    }

    // Usuario: obligatorio
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es obligatorio";
      valid = false;
    }

    // Cédula: solo números y exactamente 10 dígitos
    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es obligatoria";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener exactamente 10 números";
      valid = false;
    }

    // Correo: debe contener "@"
    if (!formData.email.includes("@")) {
      newErrors.email = "Correo inválido";
      valid = false;
    }

    // Contraseña: mínimo 6 caracteres
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }

    // Teléfono: solo números y exactamente 10 dígitos
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener exactamente 10 números";
      valid = false;
    }

    // Dirección: obligatoria
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await API.post("/usuarios/register", {
        nombre: formData.nombre,
        nombre_usuario: formData.usuario,
        correo_electronico: formData.email,
        telefono: formData.telefono,
        contrasena: formData.password,
        cedula: formData.cedula,
        direccion: formData.direccion,
      });
      setModalVisible(true);
    } catch (error) {
      console.error("Error al registrar:", error);

      const mensajeError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error desconocido al registrar usuario";

      Alert.alert("Error al registrar", mensajeError);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/pcwallpaper.jpg")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro</Text>

        {/* Campo: Nombre */}
        <TextInput
          style={[styles.input, errors.nombre && styles.errorInput]}
          placeholder="Nombre"
          value={formData.nombre}
          onChangeText={(text) => setFormData({ ...formData, nombre: text })}
        />
        {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

        {/* Campo: Usuario */}
        <TextInput
          style={[styles.input, errors.usuario && styles.errorInput]}
          placeholder="Usuario"
          value={formData.usuario}
          onChangeText={(text) => setFormData({ ...formData, usuario: text })}
        />
        {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}

        {/* Campo: Cédula */}
        <TextInput
          style={[styles.input, errors.cedula && styles.errorInput]}
          placeholder="Cédula"
          value={formData.cedula}
          onChangeText={(text) => setFormData({ ...formData, cedula: text })}
          keyboardType="numeric"
        />
        {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}

        {/* Campo: Correo */}
        <TextInput
          style={[styles.input, errors.email && styles.errorInput]}
          placeholder="Correo electrónico"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Campo: Contraseña */}
        <TextInput
          style={[styles.input, errors.password && styles.errorInput]}
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Campo: Teléfono */}
        <TextInput
          style={[styles.input, errors.telefono && styles.errorInput]}
          placeholder="Teléfono"
          value={formData.telefono}
          onChangeText={(text) => setFormData({ ...formData, telefono: text })}
          keyboardType="phone-pad"
        />
        {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

        {/* Campo: Dirección */}
        <TextInput
          style={[styles.input, errors.direccion && styles.errorInput]}
          placeholder="Dirección"
          value={formData.direccion}
          onChangeText={(text) => setFormData({ ...formData, direccion: text })}
        />
        {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}

        {/* Botón de registro */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de registro exitoso */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Registro exitoso!</Text>
            <Text style={styles.modalMessage}>
              Tu usuario ha sido creado correctamente.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Index");
              }}
            >
              <Text style={styles.modalButtonText}>Ir al inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: "100%",
  },
  button: {
    backgroundColor: "#00ffff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
  errorInput: {
    borderColor: "red",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    width: 280,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00bfa5",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#222",
    marginBottom: 18,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#00bfa5",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RegistroDazzart;
