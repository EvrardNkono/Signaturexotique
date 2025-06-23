import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { API_URL } from '../config';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [categoryInput, setCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryInput, setEditCategoryInput] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/category`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Erreur de chargement des catégories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!categoryInput.trim()) return alert('Le champ est vide.');
    if (categories.some((cat) => cat.name === categoryInput.trim()))
      return alert('Cette catégorie existe déjà.');

    try {
      const res = await fetch(`${API_URL}/admin/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryInput.trim() }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      const newCategory = await res.json();
      setCategories([...categories, newCategory]);
      setCategoryInput('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCategoryInput(cat.name);
  };

  const handleUpdateCategory = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/category/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCategoryInput.trim() }),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? { ...cat, name: editCategoryInput } : cat))
      );

      setEditingCategory(null);
      setEditCategoryInput('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/category/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Échec de la suppression");

      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Gestion des catégories 🗂️</h2>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        showForm && (
          <Card className="admin-section mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="admin-section-title">📂 Gérer les Catégories</Card.Title>

              {/* Création */}
              {!editingCategory && (
                <Form className="mb-3" onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }}>
                  <Row className="align-items-end">
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Nouvelle catégorie</Form.Label>
                        <Form.Control
                          type="text"
                          value={categoryInput}
                          onChange={(e) => setCategoryInput(e.target.value)}
                          placeholder="Ex : Fruits, Légumes, Boissons..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Button variant="success" type="submit" className="w-100">Ajouter</Button>
                    </Col>
                  </Row>
                </Form>
              )}

              {/* Édition */}
              {editingCategory && (
                <Form className="mb-3">
                  <Row className="align-items-end">
                    <Col md={10}>
                      <Form.Group>
                        <Form.Label>Modifier la catégorie</Form.Label>
                        <Form.Control
                          type="text"
                          value={editCategoryInput}
                          onChange={(e) => setEditCategoryInput(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <div className="d-flex gap-2">
                        <Button variant="warning" onClick={handleUpdateCategory}>Mettre à jour</Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setEditingCategory(null);
                            setEditCategoryInput('');
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              )}

              {/* Liste des catégories */}
              <ul className="list-group list-group-flush mt-4">
                {categories.map((cat, i) => (
                  <li
                    key={cat.id || i}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {cat.name}
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleEditCategory(cat)}
                      >
                        ✏️
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        🗑️
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        )
      )}
    </div>
  );
}
