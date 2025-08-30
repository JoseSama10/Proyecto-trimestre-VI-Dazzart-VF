import React, { useState } from "react";
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

  const validate = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
      valid = false;
    }
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es obligatorio";
      valid = false;
    }
    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es obligatoria";
      valid = false;
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Correo inválido";
      valid = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
      valid = false;
    }
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

      Alert.alert("Éxito", "Usuario registrado con éxito");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al registrar:", error);
      Alert.alert("Error", "No se pudo registrar el usuario");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/pcwallpaper.jpg")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <TextInput
          style={[styles.input, errors.nombre && styles.errorInput]}
          placeholder="Nombre"
          value={formData.nombre}
          onChangeText={(text) => setFormData({ ...formData, nombre: text })}
        />
        {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

        <TextInput
          style={[styles.input, errors.usuario && styles.errorInput]}
          placeholder="Usuario"
          value={formData.usuario}
          onChangeText={(text) => setFormData({ ...formData, usuario: text })}
        />
        {errors.usuario && <Text style={styles.errorText}>{errors.usuario}</Text>}

        <TextInput
          style={[styles.input, errors.cedula && styles.errorInput]}
          placeholder="Cédula"
          value={formData.cedula}
          onChangeText={(text) => setFormData({ ...formData, cedula: text })}
        />
        {errors.cedula && <Text style={styles.errorText}>{errors.cedula}</Text>}

        <TextInput
          style={[styles.input, errors.email && styles.errorInput]}
          placeholder="Correo electrónico"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password && styles.errorInput]}
          placeholder="Contraseña"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={[styles.input, errors.telefono && styles.errorInput]}
          placeholder="Teléfono"
          value={formData.telefono}
          onChangeText={(text) => setFormData({ ...formData, telefono: text })}
          keyboardType="phone-pad"
        />
        {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

        <TextInput
          style={[styles.input, errors.direccion && styles.errorInput]}
          placeholder="Dirección"
          value={formData.direccion}
          onChangeText={(text) => setFormData({ ...formData, direccion: text })}
        />
        {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
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
});

export default RegistroDazzart;