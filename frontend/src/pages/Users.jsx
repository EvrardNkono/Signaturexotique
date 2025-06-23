import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { Badge, Spinner, Modal, Button, Form, Table } from 'react-bootstrap';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nom: '', email: '', num_tel: '', acceptOffers: false });

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else if (Array.isArray(data.users)) setUsers(data.users);
      else setUsers([]);
    } catch (e) {
      console.error(e);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Selection handlers
  const toggleUserSelection = (id) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedUsers(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id)));
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nom: user.nom,
      email: user.email,
      num_tel: user.num_tel || '',
      acceptOffers: user.acceptOffers || false,
    });
    setShowModal(true);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Update user API call
  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const token = localStorage.getItem('token'); // Auth si besoin
      const res = await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Erreur lors de la mise à jour');
      setShowModal(false);
      fetchUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  // Delete user API call
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Confirmer la suppression de cet utilisateur ?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      fetchUsers();
      setSelectedUsers(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="warning" />
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">📋 Gestion des utilisateurs</h2>

      {users.length === 0 ? (
        <p>Aucun utilisateur trouvé.</p>
      ) : (
        <Table responsive striped bordered hover>
          <thead className="bg-orange-100">
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  checked={selectedUsers.size === users.length}
                  onChange={toggleSelectAll}
                  aria-label="Sélectionner tout"
                />
              </th>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th className="text-center">Newsletter</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const date = new Date(user.created_at).toLocaleDateString('fr-FR');
              return (
                <tr key={user.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      aria-label={`Sélectionner ${user.nom}`}
                    />
                  </td>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  <td>{user.num_tel || '–'}</td>
                  <td className="text-center">
                    {user.acceptOffers ? (
                      <Badge bg="success">Oui</Badge>
                    ) : (
                      <Badge bg="secondary">Non</Badge>
                    )}
                  </td>
                  <td>{date}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => openEditModal(user)}
                    >
                      ✏️ Modifier
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      🗑 Supprimer
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {/* Modal pour modifier utilisateur */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTel">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="num_tel"
                value={formData.num_tel}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAcceptOffers">
              <Form.Check
                type="checkbox"
                label="Accepte les offres & newsletter"
                name="acceptOffers"
                checked={formData.acceptOffers}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Tu peux ajouter un champ mot de passe ici si besoin */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
