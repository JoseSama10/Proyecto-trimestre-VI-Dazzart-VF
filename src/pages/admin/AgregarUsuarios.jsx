import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/CSSA/añadirusuario.css'; // Asegúrate de que el archivo exista y tenga los estilos adecuados

import SidebarAdmin from "../../components/SideBarAdmin.jsx";
import { useNavigate } from "react-router-dom";

export default function AgregarUsuario() {
  const navigate = useNavigate();
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      window.location.replace("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    nombre_usuario: '',
    correo: '',
    telefono: '',
    direccion: '',
    contrasena: '',
    id_rol: 1 // 1 = admin
  });

  const [verPassword, setVerPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación de cédula
    if (!/^\d{8,10}$/.test(formData.cedula)) {
      Swal.fire('Error', 'La cédula debe tener entre 8 y 10 dígitos numéricos.', 'warning');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/api/usuarios', formData);
      if (res.status === 201) {
        Swal.fire('Éxito', 'Usuario administrador creado con éxito', 'success').then(() => {
          navigate('/admin-usuarios'); // Redirección
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo registrar el administrador', 'error');
    }
  };

  return (
    <>
      <SidebarAdmin /> {/* Sidebar visible */}

      <main className="main-content p-4" style={{ marginLeft: '280px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Añadir Administrador</h1>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm w-50">
            <div className="mb-3">
              <label className="form-label">Cédula</label>
              <input type="text" className="form-control" name="cedula" value={formData.cedula} onChange={handleChange} required minLength={8} maxLength={10} pattern="\d{8,10}" />
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input type="text" className="form-control" name="nombre_usuario" value={formData.nombre_usuario} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" name="correo" value={formData.correo} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Celular</label>
              <input type="text" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input type="text" className="form-control" name="direccion" value={formData.direccion} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <div className="position-relative">
                <input
                  type={verPassword ? "text" : "password"}
                  className="form-control"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setVerPassword(prev => !prev)}
                  className="icono-password-ojito"
                >
                  <i className={`fa ${verPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Rol</label>
              <input type="text" className="form-control" name="rol" value="admin" readOnly />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-dark">Añadir</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}