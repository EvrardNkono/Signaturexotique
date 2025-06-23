// src/pages/Products.jsx
import React, { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Table, Spinner } from 'react-bootstrap';
import { API_URL } from '../config';
import { Search } from 'lucide-react';


export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [product, setProduct] = useState({
    name: '', unitPrice: '', wholesalePrice: '', category: '', image: null,
    wholesaleUnit: '', reduction: 0, lotQuantity: '', lotPrice: '', inStock: true,
    retailWeight: '', wholesaleWeight: '', details: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/admin/product?includeHidden=1`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/admin/category`);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setProduct({
      name: '', unitPrice: '', wholesalePrice: '', category: '', image: null,
      wholesaleUnit: '', reduction: 0, lotQuantity: '', lotPrice: '', inStock: true,
      retailWeight: '', wholesaleWeight: '', details: ''
    });
    setEditingProductId(null);
  };

  const handleSave = async () => {
    const method = editingProductId ? 'PUT' : 'POST';
    const url = editingProductId ? `${API_URL}/admin/product/${editingProductId}` : `${API_URL}/admin/product`;
    const token = localStorage.getItem('token');

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    if (!res.ok) return alert("Erreur lors de l'enregistrement des données");

    // Si on est en création, on envoie l'image dans la même requête avec FormData
    if (!editingProductId && product.image instanceof File) {
      const imageFormData = new FormData();
      imageFormData.append('image', product.image);
      await fetch(`${API_URL}/admin/product/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: imageFormData
      });
    }

    await fetchProducts();
    setShowForm(false);
    resetForm();
  };

  const handleUpdateImage = async () => {
    if (!editingProductId || !(product.image instanceof File)) return;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', product.image);

    const res = await fetch(`${API_URL}/admin/product/${editingProductId}/image`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) return alert("Erreur lors de la mise à jour de l'image");

    await fetchProducts();
    alert("Image mise à jour avec succès ✅");
  };

  const handleEdit = (prod) => {
    setProduct({ ...prod, image: null });
    setEditingProductId(prod.id);
    setShowForm(true);
  };

 const handleDelete = async (id) => {
  if (window.confirm("Supprimer ce produit ?")) {
    const token = localStorage.getItem('token');

    await fetch(`${API_URL}/admin/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    await fetchProducts();
  }
};

const filteredProducts = products.filter(prod =>
  prod.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Gestion des produits 🥭</h2>
      <Button onClick={() => {
        setShowForm(!showForm);
        if (showForm) resetForm();
      }} className="mb-3">
        {showForm ? 'Fermer le formulaire' : 'Créer un nouveau produit'}
      </Button>
      <div className="relative w-full max-w-md mx-auto my-4">
  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
  <Search size={18} />
</span>

  <input
    type="text"
    placeholder="Rechercher un produit exotique..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition duration-200"
  />
</div>


      {showForm && (
        <Form className="border p-3 rounded mb-4 bg-light">
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  value={product.name}
                  onChange={e => setProduct({ ...product, name: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Prix Unité (€)</Form.Label>
                <Form.Control
                  type="number"
                  value={product.unitPrice}
                  onChange={e => setProduct({ ...product, unitPrice: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Prix Gros (€)</Form.Label>
                <Form.Control
                  type="number"
                  value={product.wholesalePrice}
                  onChange={e => setProduct({ ...product, wholesalePrice: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Poids Particuliers (g)</Form.Label>
                <Form.Control
                  type="number"
                  value={product.retailWeight}
                  onChange={e => setProduct({ ...product, retailWeight: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Poids Grossistes (g)</Form.Label>
                <Form.Control
                  type="number"
                  value={product.wholesaleWeight}
                  onChange={e => setProduct({ ...product, wholesaleWeight: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Détails</Form.Label>
                <Form.Control
                  as="textarea"
                  value={product.details}
                  rows={3}
                  onChange={e => setProduct({ ...product, details: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Catégorie</Form.Label>
                <Form.Select
                  value={product.category}
                  onChange={e => setProduct({ ...product, category: e.target.value })}
                >
                  <option>Choisir...</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat.name}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Upload image */}
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Image du produit</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={e => setProduct({ ...product, image: e.target.files[0] })}
                />
                {editingProductId && (
                  <Button
                    variant="warning"
                    size="sm"
                    className="mt-2"
                    onClick={handleUpdateImage}
                  >
                    Mettre à jour l'image
                  </Button>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Button variant="success" className="mt-4" onClick={handleSave}>
            {editingProductId ? 'Modifier' : 'Créer'}
          </Button>
        </Form>
      )}

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prix</th>
              <th>Gros</th>
              <th>Catégorie</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(prod => (
  <tr key={prod.id}>
    <td>{prod.name}</td>
    <td>{prod.unitPrice} €</td>
    <td>{prod.wholesalePrice} €</td>
    <td>{prod.category}</td>
    <td>
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleEdit(prod)}
        className="me-2"
      >
        Modifier
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleDelete(prod.id)}
      >
        Supprimer
      </Button>
    </td>
  </tr>
))}

          </tbody>
        </Table>
      )}
    </div>
  );
}