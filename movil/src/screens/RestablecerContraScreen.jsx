import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import API from '../config/api';
import { useRoute, useNavigation } from '@react-navigation/native';

const RestablecerContraScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // EL TOKEN PUEDE VENIR POR PARÁMETRO EN LA RUTA
  const token = route.params?.token || '';
  console.log('TOKEN recibido:', route.params?.token);

  const handleRestablecer = async () => {
    if (!nuevaContrasena || nuevaContrasena.length < 6) {
      setFeedback({ success: false, message: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      setFeedback({ success: false, message: 'Las contraseñas no coinciden.' });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const res = await API.post('/login/reset-password', {
        token,
        nuevaContrasena,
      });
      setFeedback({ success: true, message: '¡Contraseña restablecida correctamente! Ahora puedes iniciar sesión.' });
    } catch (err) {
      setFeedback({ success: false, message: err?.response?.data?.message || 'Error al restablecer la contraseña.' });
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      <Text style={styles.label}>Nueva contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={nuevaContrasena}
        onChangeText={setNuevaContrasena}
        placeholder="Nueva contraseña"
      />
      <Text style={styles.label}>Confirmar contraseña</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
        placeholder="Confirmar contraseña"
      />
      <TouchableOpacity style={styles.button} onPress={handleRestablecer} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Restablecer</Text>}
      </TouchableOpacity>
      {feedback && (
        <Text style={{ color: feedback.success ? '#28a745' : '#d32f2f', marginTop: 12, textAlign: 'center' }}>
          {feedback.message}
        </Text>
      )}
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 18 }}>
        <Text style={{ color: '#1976d2', textAlign: 'center' }}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default RestablecerContraScreen;
