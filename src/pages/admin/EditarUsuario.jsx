import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/CSSA/actualizarusuario.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SidebarAdmin from '../../components/SideBarAdmin.jsx';

export default function EditarUsuario() {
  const { id } = useParams(); // Asegúrate que en App.jsx tienes la ruta como /editar-usuario/:id
  const navigate = useNavigate();
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      window.location.replace("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    nombre: '',
    nombre_usuario: '',
    correo: '',
    telefono: '',
    direccion: '',
    contrasena: '',
    rol: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/usuarios/usuario/${id}`);
        setFormData({
          nombre: res.data.nombre,
          nombre_usuario: res.data.nombre_usuario,
          correo: res.data.correo_electronico,
          telefono: res.data.telefono,
          direccion: res.data.direccion,
          contrasena: '',
          rol: res.data.rol,
        });
      } catch (err) {
        console.error('Error al obtener usuario:', err);
        Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error');
      }
    };

    cargarUsuario();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`http://localhost:3001/api/usuarios/${id}`, formData);
      if (res.status === 200) {
        Swal.fire('Actualizado', 'El usuario ha sido actualizado con éxito', 'success')
          .then(() => navigate('/admin-usuarios'));
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
      Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
    }
  };

  return (
    <>
      <SidebarAdmin />

      <main className="main-content p-4" style={{ marginLeft: '280px' }}>
        <h1>Actualizar Usuario</h1>

        <div className="d-flex justify-content-center align-items-center vh-80">
          <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm w-50">

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
              <label className="form-label">Nueva contraseña (opcional)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="Déjalo vacío para no cambiarla"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#888',
                    fontSize: '1.2rem',
                  }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Rol</label>
              <input type="text" className="form-control" name="rol" value={formData.rol} readOnly />
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-dark">
                <FontAwesomeIcon icon={faEdit} /> Actualizar
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}