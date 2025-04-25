import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Badge } from 'react-bootstrap';
import './AdminPage.css'; // Fichier CSS personnalisé
import OrderList from '../components/OrderList';
import { API_URL } from '../config'; 

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // Catégorie sélectionnée
const [editCategoryInput, setEditCategoryInput] = useState(''); // Nom modifié

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    unitPrice: '',
    wholesalePrice: '',
    category: '',
    image: null,
  });
  // Pour savoir si on est en train de modifier un produit
const [editingProduct, setEditingProduct] = useState(null);


  // Charger les catégories et produits depuis le backend au chargement de la page
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // Récupérer les catégories
        const categoriesResponse = await fetch(`${API_URL}/admin/category`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Récupérer les produits
        const productsResponse = await fetch(`${API_URL}/admin/product`);
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (error) {
        alert(`Erreur lors du chargement des données : ${error.message}`);
      }
    };

    fetchCategoriesAndProducts();
  }, []); // Cette partie est appelée une seule fois lors du premier rendu

  const handleAddCategory = async () => {
    if (categoryInput && !categories.some((cat) => cat.name === categoryInput)) {
      try {
        // Envoi de la requête POST au backend pour créer la catégorie
        const response = await fetch(`${API_URL}/admin/category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: categoryInput }),
        });

        if (response.ok) {
          // Si la catégorie est bien créée, ajoute-la à l'état des catégories
          const newCategory = await response.json();
          setCategories([...categories, newCategory]);
          setCategoryInput('');
        } else {
          const errorData = await response.json();
          alert(`Erreur: ${errorData.message}`);
        }
      } catch (error) {
        alert(`Erreur de connexion : ${error.message}`);
      }
    }
  };
  // Préparer le formulaire de modification de catégorie
const handleEditCategory = (category) => {
  setEditingCategory(category);
  setEditCategoryInput(category.name);
};

// Envoyer la mise à jour d'une catégorie
const handleUpdateCategory = async () => {
  if (!editCategoryInput || !editingCategory || !editingCategory.id) {
    console.error("Erreur: 'editCategoryInput' ou 'editingCategory' ou 'editingCategory.id' est undefined.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/admin/category/${editingCategory.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editCategoryInput }),
    });

    const data = await response.json();

    // Ignorer l'erreur si aucune catégorie n'est retournée
    if (response.ok && data && data.id) {
      const updatedCategories = categories.map((cat) =>
        cat.id === data.id ? { ...cat, name: data.name } : cat
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
      setEditCategoryInput('');
    }
    // Si la réponse n'est pas correcte ou que la catégorie n'existe pas, rien ne se passe ici
  } catch (error) {
    // Ne rien faire ou simplement enregistrer l'erreur sans alerte
    console.error(`Erreur de mise à jour : ${error.message}`);
  }
};



  const handleAddProduct = async () => {
    const { name, unitPrice, wholesalePrice, category, image } = product;

    if (name && unitPrice && wholesalePrice && category) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('unitPrice', unitPrice);
      formData.append('wholesalePrice', wholesalePrice);
      formData.append('category', category);
      if (image) formData.append('image', image);

      try {
        const response = await fetch(`${API_URL}/admin/product`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setProducts([...products, data.product]);
          setProduct({ name: '', unitPrice: '', wholesalePrice: '', category: '', image: null });
        } else {
          alert(`Erreur: ${data.message}`);
        }
      } catch (error) {
        alert(`Erreur serveur : ${error.message}`);
      }
    }
  };

  // Lorsqu'on clique sur "Modifier", on remplit le formulaire avec les infos existantes
const handleEditProduct = (prod) => {
  setEditingProduct(prod);
  setProduct({
    name: prod.name,
    unitPrice: prod.unitPrice,
    wholesalePrice: prod.wholesalePrice,
    category: prod.category,
    image: null, // On ne remplit pas l'image ici, elle doit être rechargée manuellement si besoin
  });
};

// Envoyer la mise à jour d'un produit existant
const handleUpdateProduct = async () => {
  const { name, unitPrice, wholesalePrice, category, image } = product;

  if (name && unitPrice && wholesalePrice && category && editingProduct) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('unitPrice', unitPrice);
    formData.append('wholesalePrice', wholesalePrice);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      const response = await fetch(`${API_URL}/admin/product/${editingProduct.id}`, {
        method: 'PUT',
        body: formData,
      });

      const updated = await response.json();
      if (response.ok) {
        // Mettre à jour la liste des produits avec la nouvelle version
        const updatedList = products.map((p) =>
          p.id === updated.product.id ? updated.product : p
        );
        setProducts(updatedList);

        // Réinitialiser le formulaire
        setEditingProduct(null);
        setProduct({ name: '', unitPrice: '', wholesalePrice: '', category: '', image: null });
      } else {
        alert(`Erreur: ${updated.message}`);
      }
    } catch (error) {
      alert(`Erreur serveur : ${error.message}`);
    }
  }
};



  return (
    <Container className="admin-container py-5">
      <h2 className="admin-title text-center mb-5">🛠️ Panneau d’administration Signature Exotique</h2>

      {/* Section : Créer une Catégorie */}
      <Card className="admin-section mb-4">
        <Card.Body>
          <Card.Title className="admin-section-title">📁 Créer une Catégorie</Card.Title>
          <Form>
            <Row className="align-items-end">
              <Col md={10}>
                <Form.Group>
                  <Form.Label>Nom de la catégorie</Form.Label>
                  <Form.Control
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="Ex : Fruits Tropicaux"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Button onClick={handleAddCategory} variant="success" className="w-100 rounded-pill">Ajouter</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Section : Créer un Produit */}
      <Card className="admin-section mb-4">
        <Card.Body>
          <Card.Title className="admin-section-title">🧺 Créer un Produit</Card.Title>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nom du produit</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    placeholder="Mangue, Ananas..."
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Prix Unité (€)</Form.Label>
                  <Form.Control
                    type="number"
                    value={product.unitPrice}
                    onChange={(e) => setProduct({ ...product, unitPrice: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Unite de mesure</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.unitPrice}
                    onChange={(e) => setProduct({  })}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Prix de Gros (€)</Form.Label>
                  <Form.Control
                    type="number"
                    value={product.wholesalePrice}
                    onChange={(e) => setProduct({ ...product, wholesalePrice: e.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Unite de mesure</Form.Label>
                  <Form.Control
                    type="text"
                    value={product.unitPrice}
                    onChange={(e) => setProduct({  })}
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
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  >
                    <option value="">Choisir une catégorie</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.name}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
  className="mt-4 rounded-pill px-4"
  variant={editingProduct ? 'warning' : 'primary'}
  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
>
  {editingProduct ? 'Mettre à jour le produit' : 'Ajouter le produit'}
</Button>

          </Form>
        </Card.Body>
      </Card>

      {/* Section : Produits créés */}
      <Card className="admin-section mb-4">
        <Card.Body>
          <Card.Title className="admin-section-title">📦 Produits Créés</Card.Title>
          <Table responsive className="table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Prix Unité</th>
                <th>Prix de Gros</th>
                <th>Catégorie</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
               <tr key={prod.id}>
               <td>
                 {prod.imageURL && (
                   <img src={prod.imageURL} alt={prod.name} width="70" className="rounded shadow-sm" />
                 )}
               </td>
               <td>{prod.name}</td>
               <td><Badge bg="info">{prod.unitPrice} €</Badge></td>
               <td><Badge bg="warning">{prod.wholesalePrice} €</Badge></td>
               <td>{prod.category}</td>
               <td> {/* ✅ Place le bouton dans un <td> */}
                 <Button
                   size="sm"
                   variant="outline-warning"
                   className="rounded-pill"
                   onClick={() => handleEditProduct(prod)}
                 >
                   Modifier
                 </Button>
               </td>
             </tr>
             
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Section : Commandes reçues */}



      {/* Section : Catégories créées */}
      <Card className="admin-section mb-4">
        <Card.Body>
          <Card.Title className="admin-section-title">📂 Catégories Créées</Card.Title>
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
      <Col md={2} className="d-flex gap-2">
        <Button
          variant="warning"
          className="w-100 rounded-pill"
          onClick={handleUpdateCategory}
        >
          Mettre à jour
        </Button>
        <Button
          variant="secondary"
          className="w-100 rounded-pill"
          onClick={() => {
            setEditingCategory(null);
            setEditCategoryInput('');
          }}
        >
          Annuler
        </Button>
      </Col>
    </Row>
  </Form>
)}
          <ul className="list-group list-group-flush">
            {categories.map((cat, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                {cat.name}
                <Button
  size="sm"
  variant="outline-secondary"
  className="rounded-pill"
  onClick={() => handleEditCategory(cat)} // 🔥 Ajout de l’action
>
  Modifier
</Button>


              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
      <Card className="admin-section mb-4">
  <Card.Body>
    <Card.Title className="admin-section-title">🧾 Commandes reçues</Card.Title>
    <OrderList />
  </Card.Body>
</Card>
      
    </Container>
    
    
    
  );
};

export default AdminPage;
