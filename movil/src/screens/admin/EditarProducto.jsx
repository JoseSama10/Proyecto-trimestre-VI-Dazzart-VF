import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import API from "../../config/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

export default function EditarProducto() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params || {};

  const [form, setForm] = useState({
    numero_serial: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    id_categoria: "",
    id_subcategoria: "",
    fecha_creacion: "",
  });
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [imagenNueva, setImagenNueva] = useState(null);
  const [imagenActual, setImagenActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar categorías
  useEffect(() => {
    API.get("/categorias/listar").then((res) => {
      setCategorias(res.data || []);
    });
  }, []);

  // Cargar subcategorías según categoría seleccionada
  useEffect(() => {
    if (form.id_categoria) {
      API.get("/subcategorias/listar").then((res) => {
        const filtradas = res.data.filter(
          (s) => String(s.id_categoria) === String(form.id_categoria)
        );
        setSubcategorias(filtradas);
      });
    } else {
      setSubcategorias([]);
    }
  }, [form.id_categoria]);

  // Cargar producto
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const res = await API.get(`/productos/${id}`);
        const prod = res.data;

        // Setear categoría primero
        const categoriaId = prod.id_categoria ? String(prod.id_categoria) : "";
        setForm((prev) => ({
          ...prev,
          numero_serial: prod.numero_serial || "",
          nombre: prod.nombre || "",
          descripcion: prod.descripcion || "",
          precio: String(Math.floor(prod.precio || 0)), // Precio sin decimales
          stock: String(prod.stock || ""),
          id_categoria: categoriaId,
          fecha_creacion: prod.fecha_creacion
            ? new Date(prod.fecha_creacion).toLocaleDateString("es-CO")
            : "",
        }));

        setImagenActual(prod.imagen || null);

        // Cargar subcategorías y luego setear subcategoría seleccionada
        if (categoriaId) {
          const resSub = await API.get("/subcategorias/listar");
          const filtradas = resSub.data.filter(
            (s) => String(s.id_categoria) === categoriaId
          );
          setSubcategorias(filtradas);
          setForm((prev) => ({
            ...prev,
            id_subcategoria: prod.id_subcategoria ? String(prod.id_subcategoria) : "",
          }));
        }
      } catch {
        Alert.alert("Error", "No se pudo cargar el producto");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    if (id) cargarProducto();
  }, [id, navigation]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Se necesita permiso para acceder a tus fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagenNueva(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.precio || !form.stock || !form.id_categoria) {
      Alert.alert("Campos requeridos", "Completa todos los campos obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });
      if (imagenNueva) {
        fd.append("imagen", {
          uri: Platform.OS === "android" ? imagenNueva.uri : imagenNueva.uri.replace("file://", ""),
          name: imagenNueva.fileName || "producto.jpg",
          type: imagenNueva.type || "image/jpeg",
        });
      }
      await API.put(`/productos/editar/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Éxito", "Producto actualizado correctamente", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Cargando producto...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>

      <Text style={styles.label}>Número Serial *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#e9ecef", color: "#888" }]}
        value={form.numero_serial}
        editable={false}
        selectTextOnFocus={false}
      />

      <Text style={styles.label}>Nombre *</Text>
      <TextInput
        style={styles.input}
        value={form.nombre}
        onChangeText={(text) => handleChange("nombre", text)}
      />

      <Text style={styles.label}>Descripción *</Text>
      <TextInput
        style={styles.input}
        value={form.descripcion}
        onChangeText={(text) => handleChange("descripcion", text)}
        multiline
      />

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Precio *</Text>
          <TextInput
            style={styles.input}
            value={form.precio}
            onChangeText={(text) => handleChange("precio", text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Stock *</Text>
          <TextInput
            style={styles.input}
            value={form.stock}
            onChangeText={(text) => handleChange("stock", text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Categoría */}
      <Text style={styles.label}>Categoría *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={form.id_categoria}
          onValueChange={(value) => handleChange("id_categoria", value)}
        >
          <Picker.Item label="Seleccionar categoría" value="" />
          {categorias.map((cat) => (
            <Picker.Item key={cat.id_categoria} label={cat.nombre_categoria} value={cat.id_categoria} />
          ))}
        </Picker>
      </View>

      {/* Subcategoría */}
      {subcategorias.length > 0 && (
        <>
          <Text style={styles.label}>Subcategoría</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.id_subcategoria}
              onValueChange={(value) => handleChange("id_subcategoria", value)}
            >
              <Picker.Item label="Seleccionar subcategoría" value="" />
              {subcategorias.map((sub) => (
                <Picker.Item key={sub.id_subcategoria} label={sub.nombre_subcategoria} value={sub.id_subcategoria} />
              ))}
            </Picker>
          </View>
        </>
      )}

      <Text style={styles.label}>Fecha de Creación *</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#e9ecef", color: "#888" }]}
        value={form.fecha_creacion}
        editable={false}
        selectTextOnFocus={false}
      />

      <Text style={styles.label}>Imagen</Text>
      <TouchableOpacity style={styles.imgBtn} onPress={handleImagePick}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Seleccionar imagen</Text>
      </TouchableOpacity>

      {imagenNueva ? (
        <Image
          source={{ uri: imagenNueva.uri }}
          style={{ width: 120, height: 120, marginTop: 10, alignSelf: "center", borderRadius: 8 }}
        />
      ) : imagenActual ? (
        <Image
          source={{
            uri: `${API.defaults.baseURL.replace("/api", "")}/productos/img/${encodeURIComponent(
              imagenActual.replace(/^\/?img\//, "")
            )}`,
          }}
          style={{ width: 120, height: 120, marginTop: 10, alignSelf: "center", borderRadius: 8 }}
        />
      ) : null}

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSubmit}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>{saving ? "Guardando..." : "Guardar Cambios"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#212529",
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#212529",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
  },
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 4,
  },
  imgBtn: {
    backgroundColor: "#198754",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtn: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 10,
    marginTop: 28,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
});
