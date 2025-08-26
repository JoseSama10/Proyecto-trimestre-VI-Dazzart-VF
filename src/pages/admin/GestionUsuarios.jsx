import React, { useEffect, useState } from "react";
import axios from "axios";
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "../../css/CSSA/gestionusuarios.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../../components/SideBarAdmin";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const cargarUsuarios = () => {
    axios.get("http://localhost:3001/api/usuarios")
      .then(res => {
        if (Array.isArray(res.data)) {
          setUsuarios(res.data);
        } else {
          setUsuarios([]);
        }

        setTimeout(() => {
          if (!$.fn.DataTable.isDataTable("#tablaUsuarios")) {
            $('#tablaUsuarios').DataTable({
              responsive: true,
              autoWidth: false,
              pageLength: 4,
              lengthMenu: [[4, 8, 10], [4, 8, 10]],
              language: {
                lengthMenu: "Mostrar _MENU_ registros por página",
                zeroRecords: "No se encontraron resultados",
                info: "Mostrando página _PAGE_ de _PAGES_",
                infoEmpty: "No hay registros disponibles",
                infoFiltered: "(filtrado de _MAX_ registros en total)",
                search: "Buscar:",
                paginate: {
                  first: "Primero",
                  last: "Último",
                  next: "Siguiente",
                  previous: "Anterior"
                }
              },
              columnDefs: [
                {
                  targets: [0, 3, 4],
                  searchable: true
                },
                {
                  targets: "_all",
                  searchable: false
                }
              ]
            });
          }
        }, 100);
      })
      .catch(err => console.error(err));
  };

  const eliminarUsuario = async (id) => {
    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Eliminar usuario',
      text: '¿Estás seguro de eliminar este usuario?',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    // Obtener usuario logueado
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

    try {
      const response = await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
      if (response.status === 200) {
        await Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        // Si el usuario eliminado es el admin logueado, recargar al index
        if (usuarioLogueado && usuarioLogueado.id_usuario === id && usuarioLogueado.id_rol === 1) {
          localStorage.removeItem('usuario');
          window.location.replace('/');
          return;
        }
        if ($.fn.DataTable.isDataTable("#tablaUsuarios")) {
          $("#tablaUsuarios").DataTable().destroy();
        }
        cargarUsuarios();
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      if (error.response && error.response.status === 409) {
        Swal.fire('Error', error.response.data.error, 'warning'); // mensaje personalizado
      } else {
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      window.location.replace("/");
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <>
      <SidebarAdmin />

      <main className="main-content p-4" style={{ marginLeft: "280px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Gestión de usuarios</h1>
          <a href="/agregar-usuarios" className="btn btn-warning text-white">Añadir Administrador</a>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped" id="tablaUsuarios">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Cédula</th>
                <th>Nombre</th>
                <th>Nombre de usuario</th>
                <th>Correo electrónico</th>
                <th>Celular</th>
                <th>Dirección</th>
                <th>Contraseña</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.cedula}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.nombre_usuario}</td>
                  <td>{usuario.correo_electronico}</td>
                  <td>{usuario.telefono}</td>
                  <td>{usuario.direccion}</td>
                  <td>*******</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-success btn-sm" onClick={() => navigate(`/editar-usuario/${usuario.id_usuario}`)}>
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </button>
                      <button
                        onClick={() => eliminarUsuario(usuario.id_usuario)}
                        className="btn btn-danger btn-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}