import React, { useState, useEffect } from "react";
import { Button, Card, Container, Row, Col } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
//import NavbarSesion from "components/Navbars/NavbarSesion.js";
//Service
import { API_URL } from 'src/configs/constans'
//Hook
import { useAuth } from '../context/AuthProvider'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const auth = useAuth();
  const { idChef } = useParams();
  //const history = useNavigate();
  const [ventasPorChef, setVentasPorChef] = useState([]);
  const [platosVendidos, setPlatosVendidos] = useState([]);
  const [platosChef, setPlatosChef] = useState([]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Asegura que el valor sea uno de los permitidos
      },
      /* title: {
        display: true,
        text: "Ventas por chef",
      }, */
    },
  };  

  const labels = ["Noviembre", "Diciembre"];

  //Solicitud

  const fetchingPlatosVendidos = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/ventas/${auth.getUser()?.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        const json = await response.json();
  
        const clone = json.body.data.map((item: { nombreProducto: any; totalVentas: any; porcentajeDescuento: any }, i: number) => {
          const hue = (i * 50) % 360; // Ajusta el 50 para obtener colores distintos
          const backgroundColor = `hsla(${hue}, 70%, 50%, 0.5)`;
  
          return {
            label: item.nombreProducto,
            data: [item.totalVentas],
            backgroundColor: backgroundColor,
            porcentajeDescuento: item.porcentajeDescuento, // Nuevo campo para el porcentaje de descuento
          };
        });
  
        setVentasPorChef(clone);
      } else {
        // Manejar la respuesta no exitosa si es necesario
      }
    } catch (error) {
      console.error(error);
    }
  };  

  //DataSet
  const data = {
    labels,
    datasets: ventasPorChef.map((item: { label: any; data: any; backgroundColor: any; porcentajeDescuento: any }) => ({
      label: `${item.label} (${item.porcentajeDescuento}%)`, // Etiqueta modificada para incluir el porcentaje de descuento
      data: item.data,
      backgroundColor: item.backgroundColor,
    })),
  };

  useEffect(() => {
    fetchingPlatosVendidos();
  }, [auth]);

  return (
    <>
      {/*<NavbarSesion />*/}
      <main className="profile-page">
        <section className="section-profile-cover section-shaped my-0">
          <div className="mt-5 py-5 border-top text-center">
            <Row className="justify-content-center mb-5">
              <Col lg="12">
                <h2>Ventas por productos</h2>
              </Col>
              <Bar options={options} data={data} />
            </Row>
          </div>
        </section>
      </main>
    </>
  );
};

export default Dashboard;
