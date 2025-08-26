import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import SimpleHeader from '../../components/cliente/SimpleHeader.jsx';
import Footer from '../../components/cliente/Footer';

export default function Factura() {
  const { id_factura } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      navigate('/');
      return;
    }
    const parsedUsuario = JSON.parse(usuarioGuardado);
    if (Number(parsedUsuario.id_rol) !== 2) {
      navigate('/');
      return;
    }

    const cargarFactura = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/pedidos/${id_factura}`);
        if (!res.ok) throw new Error("Factura no encontrada");
        const data = await res.json();

        if (typeof data.productos === 'string') {
          try {
            data.productos = JSON.parse(data.productos);
          } catch (e) {
            console.warn("Error al parsear productos:", e);
            data.productos = [];
          }
        }

        setPedido(data);
      } catch (error) {
        console.error(error);
        setPedido(null);
      } finally {
        setLoading(false);
      }
    };
    cargarFactura();
  }, [navigate, id_factura]);

  const formatoMoneda = (num) =>
    Number(num).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });

  const descargarPDF = () => {
    if (!pedido) return;

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor("#2c3e50");
    doc.text("Factura de Compra", 14, 22);

    doc.setFontSize(14);
    doc.setTextColor("#34495e");
    doc.text(`Factura #: ${pedido.id_factura}`, 14, 34);
    doc.text(`Cliente: ${pedido.nombre_cliente || "Usuario"}`, 14, 44);
    doc.text(`Dirección: ${pedido.direccion || "No especificada"}`, 14, 54);
    const fechaTexto = new Date(pedido.fecha || Date.now()).toLocaleDateString("es-CO");
    doc.text(`Fecha: ${fechaTexto}`, 14, 64);

    let startY = 78;
    doc.setFontSize(12);
    doc.setTextColor("#2980b9");
    doc.text("Producto", 14, startY);
    doc.text("Cantidad", 90, startY);
    doc.text("Precio", 130, startY);
    doc.text("Subtotal", 170, startY);
    startY += 6;

    doc.setFontSize(11);
    doc.setTextColor("#34495e");

    if (Array.isArray(pedido.productos) && pedido.productos.length > 0) {
      pedido.productos.forEach((prod) => {
        const precio = Number(prod.precio);
        const cantidad = Number(prod.cantidad);
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
        doc.text(prod.nombre || prod.nombre_producto || "Producto", 14, startY);
        doc.text(String(cantidad), 90, startY);
        doc.text(formatoMoneda(precio), 130, startY);
        doc.text(formatoMoneda(precio * cantidad), 170, startY);
        startY += 8;
      });
    } else {
      doc.text("No hay productos en esta factura.", 14, startY);
    }

    if (startY > 260) {
      doc.addPage();
      startY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor("#2980b9");
    doc.text(`Total: ${formatoMoneda(pedido.total)}`, 14, startY + 15);

    doc.save(`Factura_${pedido.id_factura}.pdf`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="d-flex flex-column min-vh-100 bg-light">
        <SimpleHeader />
        <main className="container my-5 text-center flex-grow-1 d-flex flex-column justify-content-center">
          <h2 className="text-secondary fw-semibold">No se encontró la factura.</h2>
          <button
            className="btn btn-outline-primary mt-3 px-4"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <SimpleHeader />
      <main className="container my-5 p-5 rounded shadow-sm bg-white flex-grow-1" style={{ maxWidth: 900 }}>
        <h2 className="text-center mb-5" style={{ color: "#2c3e50", fontWeight: 700 }}>
          Detalle Pedido
        </h2>

        <div className="row mb-4 text-center text-md-start" style={{ color: "#34495e", fontWeight: 500 }}>
          <div className="col-md-4">
            <div className="text-uppercase mb-1 fs-6 text-muted">Cliente</div>
            <div>{pedido.nombre_cliente || "Usuario"}</div>
          </div>
          <div className="col-md-4">
            <div className="text-uppercase mb-1 fs-6 text-muted">Dirección</div>
            <div>{pedido.direccion || "No especificada"}</div>
          </div>
          <div className="col-md-4">
            <div className="text-uppercase mb-1 fs-6 text-muted">Fecha</div>
            <div>{new Date(pedido.fecha || Date.now()).toLocaleDateString("es-CO")}</div>
          </div>
        </div>

        <div className="table-responsive shadow-sm rounded" style={{ border: "1px solid #ddd" }}>
          <table className="table mb-0">
            <thead style={{ backgroundColor: "#f8f9fa" }}>
              <tr style={{ color: "#2980b9", fontWeight: 600 }}>
                <th className="py-3">Producto</th>
                <th className="text-center py-3">Cantidad</th>
                <th className="text-end py-3">Precio</th>
                <th className="text-end py-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
                pedido.productos.map((prod, idx) => {
                  const precio = Number(prod.precio);
                  const cantidad = Number(prod.cantidad);
                  return (
                    <tr key={idx} style={{ color: "#34495e", fontWeight: 500 }}>
                      <td className="py-3">{prod.nombre || prod.nombre_producto || "Producto"}</td>
                      <td className="text-center py-3">{cantidad}</td>
                      <td className="text-end py-3">{formatoMoneda(precio)}</td>
                      <td className="text-end py-3">{formatoMoneda(precio * cantidad)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center fst-italic py-4" style={{ color: "#7f8c8d" }}>
                    No hay productos en esta factura.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-end mt-4" style={{ fontWeight: 700, fontSize: "1.25rem", color: "#2980b9" }}>
          Total: {formatoMoneda(pedido.total)}
        </div>

        <div className="text-center mt-5">
          <button className="btn btn-outline-primary me-3 px-4" onClick={() => navigate("/")}>
            Volver a inicio
          </button>
          <button className="btn btn-primary px-4" onClick={descargarPDF}>
            Descargar PDF
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}