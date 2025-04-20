// src/components/admin/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { API_URL } from '../config'; 

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/modules/checkout`); // Utiliser API_URL
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des commandes');
        }
        const data = await response.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des commandes.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h3>Commandes reçues</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Adresse</th>
            <th>Ville</th>
            <th>Téléphone</th>
            <th>Livraison</th>
            <th>Paiement</th>
            <th>Produits</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <td>{order.firstName} {order.lastName}</td>
              <td>{order.address}</td>
              <td>{order.city} ({order.postalCode}, {order.country})</td>
              <td>{order.phone}</td>
              <td>{order.deliveryMethod}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <ul>
                  {JSON.parse(order.items).map((item, i) => (
                    <li key={i}>{item.name} x{item.quantity}</li>
                  ))}
                </ul>
              </td>
              <td>{order.total.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderList;
