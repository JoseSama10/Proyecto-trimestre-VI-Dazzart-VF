import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderRegistro from '../../components/cliente/HeaderRegistro';
import Footer from '../../components/cliente/Footer';
import axios from 'axios';
import '../../css/CSS/Registro.css';

import fondoGif from '../../assets/giphy.gif';

const RegistroDazzart = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    cedula: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [verPassword, setVerPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Nombre: solo letras y espacios, mínimo 3 caracteres
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(formData.nombre.trim())) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios (mínimo 3 caracteres)";
    }

    // Usuario: letras, números, guiones bajos y puntos, 3-15 caracteres
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es obligatorio";
    } else if (!/^[a-zA-Z0-9._]{3,15}$/.test(formData.usuario.trim())) {
      newErrors.usuario = "Usuario inválido (3-15 caracteres, letras, números, _ y . permitidos)";
    }

    // Cédula: solo números, mínimo 8 y máximo 10 dígitos
    if (!formData.cedula.trim()) {
      newErrors.cedula = "La cédula es obligatoria";
    } else if (!/^\d{8,10}$/.test(formData.cedula.trim())) {
      newErrors.cedula = "Cédula inválida (8-10 números)";
    }

    // Email: validación básica email
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Correo electrónico inválido";
    }

    // Contraseña: mínimo 6 caracteres, al menos una letra y un número
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres, incluyendo letras y números";
    }

    // Teléfono: solo números, entre 7 y 15 dígitos
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{7,15}$/.test(formData.telefono.trim())) {
      newErrors.telefono = "Teléfono inválido (7-15 dígitos numéricos)";
    }

    // Dirección: mínimo 5 caracteres
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
    } else if (formData.direccion.trim().length < 5) {
      newErrors.direccion = "La dirección es muy corta";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

try {
  await axios.post('http://localhost:3001/api/usuarios/register', {
    nombre: formData.nombre,
    nombre_usuario: formData.usuario,
    correo_electronico: formData.email,
    telefono: formData.telefono,
    contrasena: formData.password,
    cedula: formData.cedula,
    direccion: formData.direccion
  });

  // alert eliminado
  window.location.href = '/';

} catch (error) {
  console.error('Error al registrar:', error);
  alert('Error al registrar usuario');
}

  };

  // Botón volver (igual que antes)
  const handleVolver = () => {
    window.history.back();
  };

  return (
    <div className="registro-wrapper">
      <HeaderRegistro />

      <button
        className="btn btn-secondary btn-volver"
        onClick={handleVolver}
        aria-label="Volver"
      >
        - Regresar
      </button>

      <img src={fondoGif} alt="Fondo animado" className="bg-gif" />
      <div className="overlay"></div>

      <div className="form-container">
        <form className="glass-form" onSubmit={handleSubmit} noValidate>
          <h2 className="text-center mb-4 text-white">Crea tu cuenta</h2>

          <div className="mb-3">
            <input
              type="text"
              name="nombre"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              placeholder="Nombre completo"
              required
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="usuario"
              className={`form-control ${errors.usuario ? 'is-invalid' : ''}`}
              placeholder="Usuario"
              required
              value={formData.usuario}
              onChange={handleChange}
            />
            {errors.usuario && <div className="invalid-feedback">{errors.usuario}</div>}
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="cedula"
              className={`form-control ${errors.cedula ? 'is-invalid' : ''}`}
              placeholder="Cédula"
              required
              minLength={8}
              maxLength={10}
              pattern="\d{8,10}"
              value={formData.cedula}
              onChange={handleChange}
            />
            {errors.cedula && <div className="invalid-feedback">{errors.cedula}</div>}
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Correo electrónico"
              required
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3 position-relative">
            <input
              type={verPassword ? "text" : "password"}
              name="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Contraseña"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <span
              onClick={() => setVerPassword(prev => !prev)}
              className="icono-password-ojito"
            >
              <i className={`fa ${verPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </span>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="mb-3">
            <input
              type="tel"
              name="telefono"
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              placeholder="Teléfono"
              required
              value={formData.telefono}
              onChange={handleChange}
            />
            {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
          </div>

          <div className="mb-3">
            <textarea
              name="direccion"
              className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
              rows="2"
              placeholder="Dirección"
              required
              value={formData.direccion}
              onChange={handleChange}
            ></textarea>
            {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
          </div>

          <button type="submit" className="btn btn-negro-hover-azul w-100 mt-3">
            Registrarme
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default RegistroDazzart;
