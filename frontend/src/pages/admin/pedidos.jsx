import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import SidebarAdmin from "../../components/SideBarAdmin.jsx";
import { useNavigate } from "react-router-dom";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      window.location.replace("/");
    }
  }, []);

const cargarPedidos = async () => {
  try {
    const res = await fetch("http://localhost:3001/api/pedidos");
    const data = await res.json();

    if (Array.isArray(data)) {
      // Parsear productos si vienen como string
      const pedidosParseados = data.map(pedido => {
        if (typeof pedido.productos === 'string') {
          try {
            pedido.productos = JSON.parse(pedido.productos);
          } catch (e) {
            console.warn(`Error al parsear productos del pedido ${pedido.id_factura}`);
            pedido.productos = [];
          }
        }
        return pedido;
      });

      setPedidos(pedidosParseados);
    } else {
      setPedidos([]);
      console.error("Respuesta no es arreglo:", data);
    }
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
  }
};
  useEffect(() => {
    cargarPedidos();
  }, []);

  useEffect(() => {
    if (pedidos.length === 0) return;

    if ($.fn.DataTable.isDataTable("#tablaPedidos")) {
      $("#tablaPedidos").DataTable().clear().destroy();
    }

    const timer = setTimeout(() => {
      $("#tablaPedidos").DataTable({
        responsive: true,
        autoWidth: false,
        pageLength: 10,
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
            previous: "Anterior",
          },
        },
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if ($.fn.DataTable.isDataTable("#tablaPedidos")) {
        $("#tablaPedidos").DataTable().clear().destroy();
      }
    };
  }, [pedidos]);

  const renderProductos = (productos) => {
    if (!Array.isArray(productos)) return "Sin productos";
    return productos.map((p, i) => `${p.nombre} (x${p.cantidad})`).join(", ");
  };

  return (
    <>
      <SidebarAdmin />

      <main className="main-content p-4" style={{ marginLeft: "280px" }}>
        <h1>Gestión de pedidos</h1>

        <div className="table-responsive">
          <table className="table table-striped table-hover" id="tablaPedidos">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Dirección</th>
                <th>Nombre</th>
                <th>Productos</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id_factura}>
                  <td>{pedido.id_factura}</td>
                  <td>{pedido.direccion}</td>
                  <td>{pedido.nombre_cliente}</td>
                  <td>{renderProductos(pedido.productos)}</td>
                  <td>{pedido.total_productos}</td>
                  <td>${Number(pedido.total).toLocaleString("es-CO")}</td>
                  <td>{pedido.estado}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => navigate(`/ver-factura/${pedido.id_factura}`)}
                    >
                      Observar
                    </button>
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