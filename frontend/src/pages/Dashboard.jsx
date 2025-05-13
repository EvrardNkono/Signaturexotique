import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Badge } from 'react-bootstrap';
import './AdminPage.css'; // Fichier CSS personnalisé
import OrderList from '../components/OrderList';
import { API_URL } from '../config'; 
import PopupUploader from '../components/PopupUploader';
import AdminRecipeForm from '../components/AdminRecipeForm';


const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // Catégorie sélectionnée
const [editCategoryInput, setEditCategoryInput] = useState(''); // Nom modifié
const [reductionInput, setReductionInput] = useState(''); // Champ pour entrer la réduction
  const [editingProduct, setEditingProduct] = useState(null); // Produit en cours d'édition
 

 const [products, setProducts] = useState([]);

const [product, setProduct] = useState({
  name: '',
  unitPrice: '',
  wholesalePrice: '',
  category: '',
  image: null,
  wholesaleUnit: '',
  reduction: 0,
  lotQuantity: '',
  lotPrice: '',
  inStock: true,
  retailWeight: '',
  wholesaleWeight: '',
  details: '', // 🆕 Nouveau champ ajouté ici
});

  



  // Fonction pour gérer la mise à jour de la réduction


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
  // Vérifie que le champ n'est pas vide et que la catégorie n'existe pas déjà
  if (categoryInput.trim() && !categories.some((cat) => cat.name === categoryInput)) {
    try {
      // Envoi de la requête POST au backend pour créer la catégorie
      const response = await fetch(`${API_URL}/admin/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryInput }),
      });

      // Vérifie si la requête a abouti
      if (response.ok) {
        const newCategory = await response.json();
        
        // Mise à jour de l'état des catégories
        setCategories((prevCategories) => [...prevCategories, newCategory]);

        // Réinitialise l'input après l'ajout
        setCategoryInput('');
        
        alert('Catégorie ajoutée avec succès!');
      } else {
        const errorData = await response.json();
        alert(`Erreur : ${errorData.message || 'Impossible de créer la catégorie.'}`);
      }
    } catch (error) {
      // Affiche une alerte en cas d'erreur réseau
      alert(`Erreur de connexion : ${error.message}`);
    }
  } else {
    // Si l'input est vide ou la catégorie existe déjà, affiche un message d'erreur
    if (!categoryInput.trim()) {
      alert('Le nom de la catégorie ne peut pas être vide.');
    } else {
      alert('Cette catégorie existe déjà.');
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
  const {
    name,
    unitPrice,
    wholesalePrice,
    category,
    image,
    reduction,
    lotPrice = '',
    lotQuantity = '',
    inStock,
    retailWeight,
    wholesaleWeight,
    details, // ✅ Ajout du champ details
  } = product;

  // ✅ Validation : tous les champs obligatoires sont remplis
  if (name && unitPrice && wholesalePrice && category && retailWeight && wholesaleWeight) {
    if ((lotPrice && !lotQuantity) || (!lotPrice && lotQuantity)) {
      return alert('Veuillez remplir à la fois la quantité et le prix du lot, ou laissez les deux vides.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('unitPrice', unitPrice);
    formData.append('wholesalePrice', wholesalePrice);
    formData.append('category', category);
    formData.append('reduction', reduction);
    formData.append('inStock', inStock);
    formData.append('retailWeight', retailWeight);
    formData.append('wholesaleWeight', wholesaleWeight);
    formData.append('details', details); // ✅ Ajout dans le FormData

    if (image) formData.append('image', image);
    if (lotQuantity) formData.append('lotQuantity', lotQuantity);
    if (lotPrice) formData.append('lotPrice', lotPrice);

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert('Token d\'authentification manquant');

      const response = await fetch(`${API_URL}/admin/product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Erreur de serveur:', errorText);
        let errorMessage = 'Erreur serveur';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Erreur serveur';
        } catch (e) {
          console.error('Erreur lors du parsing JSON', e);
        }
        alert(errorMessage);
        return;
      }

      const responseData = await response.json();
      console.log('Réponse du serveur:', responseData);

      if (responseData && responseData.product) {
        setProducts([...products, responseData.product]);
        setProduct({
          name: '',
          unitPrice: '',
          wholesalePrice: '',
          category: '',
          image: null,
          reduction: 0,
          lotQuantity: '',
          lotPrice: '',
          inStock: true,
          retailWeight: '',
          wholesaleWeight: '',
          details: '', // ✅ Reset du champ
        });
      } else {
        alert('Produit créé avec succès, mais la réponse est invalide.');
      }

    } catch (error) {
      console.error('Erreur lors de la requête:', error);
      alert(`Erreur serveur : ${error.message}`);
    }
  } else {
    alert("Tous les champs obligatoires ne sont pas remplis, y compris les deux poids !");
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
    reduction: prod.reduction || 0,
    image: null,
    lotQuantity: prod.lotQuantity || '',
    lotPrice: prod.lotPrice || '',
    inStock: prod.inStock ?? true, // ✅ Garde le booléen même s’il est false
    retailWeight: prod.retailWeight || '',       // ✅ Nouveau champ
    wholesaleWeight: prod.wholesaleWeight || '', // ✅ Nouveau champ
    details: prod.details || '',  // ✅ Nouveau champ details
  });
};

const handleDeleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/admin/product/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // ✅ Securité : vérifier si le corps est vide avant de parser
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || 'Échec de la suppression');
    }

    // 🔄 Mettre à jour l’état local des produits
    setProducts((prev) => prev.filter((prod) => prod.id !== id));

    toast.success(data.message || 'Produit supprimé avec succès ✅');
  } catch (err) {
    console.error('Erreur suppression :', err.message || err);
    toast.error('Erreur lors de la suppression du produit 😢');
  }
};


// Envoyer la mise à jour d'un produit existant
// Envoyer la mise à jour d'un produit existant
const handleUpdateProduct = async () => {
  const {
    name,
    unitPrice,
    wholesalePrice,
    category,
    reduction,
    image,
    lotQuantity,
    lotPrice,
    inStock,
    retailWeight,
    wholesaleWeight,
    details, // ✅ Ajout du champ details
  } = product;

  if (name && unitPrice && wholesalePrice && category && retailWeight && wholesaleWeight && details && editingProduct) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('unitPrice', unitPrice);
    formData.append('wholesalePrice', wholesalePrice);
    formData.append('category', category);
    formData.append('reduction', reduction);
    formData.append('inStock', inStock);

    formData.append('retailWeight', retailWeight);
    formData.append('wholesaleWeight', wholesaleWeight);
    formData.append('details', details); // ✅ Ajout des détails du produit

    if (image) formData.append('image', image);
    if (lotQuantity) formData.append('lotQuantity', lotQuantity);
    if (lotPrice) formData.append('lotPrice', lotPrice);

    try {
      const token = localStorage.getItem('token');
      if (!token) return alert("Token d'authentification manquant");

      const response = await fetch(`${API_URL}/admin/product/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Erreur serveur';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Erreur JSON', e);
        }
        alert(errorMessage);
        return;
      }

      const responseData = await response.json();
      console.log('Produit mis à jour:', responseData);

      if (responseData && responseData.product) {
        const updatedProducts = products.map(p => p._id === responseData.product._id ? responseData.product : p);
        setProducts(updatedProducts);
        setProduct({
          name: '',
          unitPrice: '',
          wholesalePrice: '',
          category: '',
          reduction: 0,
          image: null,
          lotQuantity: '',
          lotPrice: '',
          inStock: true,
          retailWeight: '',
          wholesaleWeight: '',
          details: '', // ✅ Réinitialisation du champ details
        });
        setEditingProduct(null);
      }

    } catch (error) {
      console.error('Erreur réseau ou serveur :', error);
      alert(`Erreur serveur : ${error.message}`);
    }

  } else {
    alert('Veuillez remplir tous les champs obligatoires (poids et détails inclus).');
  }
};

  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  return (
    <Container className="admin-container py-5">
      <h2 className="admin-title text-center mb-5">🛠️ Panneau d’administration Signature Exotique</h2>

      {/* Boutons pour afficher/masquer les sections */}
      <div className="d-flex gap-3 mb-4 justify-content-center">
        <Button variant="outline-primary" onClick={() => setShowProductForm(!showProductForm)}>
          {showProductForm ? '🔽 Cacher Produits' : '➕ Créer un Produit'}
        </Button>
        <Button variant="outline-success" onClick={() => setShowCategoryForm(!showCategoryForm)}>
          {showCategoryForm ? '🔽 Cacher Catégories' : '📂 Créer une Catégorie'}
        </Button>
        <Button variant="outline-warning" onClick={() => setShowRecipeForm(!showRecipeForm)}>
          {showRecipeForm ? '🔽 Cacher Recettes' : '🍲 Créer une Recette'}
        </Button>
      </div>

     {/* SECTION PRODUITS */}
{showProductForm && (
  <Card className="admin-section mb-4">
    <Card.Body>
      <Card.Title className="admin-section-title">
        {editingProduct ? '✏️ Modifier un Produit' : '🧺 Créer un Produit'}
      </Card.Title>

      {/* Formulaire création/modification */}
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
        </Row>

        <Row className="mt-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Prix Unité (€)</Form.Label>
              <Form.Control
                type="number"
                value={product.unitPrice}
                onChange={(e) => setProduct({ ...product, unitPrice: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Poids pour particuliers (g)</Form.Label>
              <Form.Control
                type="number"
                value={product.retailWeight || ''}
                onChange={(e) =>
                  setProduct({ ...product, retailWeight: parseInt(e.target.value) || '' })
                }
                placeholder="Ex : 500"
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

            <Form.Group className="mt-2">
              <Form.Label>Poids pour grossistes (g)</Form.Label>
              <Form.Control
                type="number"
                value={product.wholesaleWeight || ''}
                onChange={(e) =>
                  setProduct({ ...product, wholesaleWeight: parseInt(e.target.value) || '' })
                }
                placeholder="Ex : 1000"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
  <Form.Group className="mb-3">
    <Form.Label>Détails du produit</Form.Label>
    <Form.Control
      as="textarea"
      rows={4}
      placeholder="Goût intense, sans conservateurs..."
      value={product.details}
      onChange={(e) => setProduct({ ...product, details: e.target.value })}
      maxLength={300} // 👈 Limite à 300 caractères
    />
    <div className="text-end small text-muted mt-1">
      {product.details.length}/300 caractères
    </div>
  </Form.Group>
</Col>


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

            <Form.Group className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setProduct({ ...product, image: e.target.files[0] })}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="formInStock" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Produit en stock"
            checked={product.inStock}
            onChange={(e) => setProduct({ ...product, inStock: e.target.checked })}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Réduction (%)</Form.Label>
          <Form.Control
            type="number"
            value={product.reduction}
            onChange={(e) => setProduct({ ...product, reduction: e.target.value })}
            placeholder="Ex : 10"
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Quantité du lot (optionnel)</Form.Label>
          <Form.Control
            type="number"
            value={product.lotQuantity || ''}
            onChange={(e) => setProduct({ ...product, lotQuantity: e.target.value })}
            placeholder="Ex : 3"
          />
        </Form.Group>

        <Form.Group className="mt-2">
          <Form.Label>Prix du lot (optionnel)</Form.Label>
          <Form.Control
            type="number"
            value={product.lotPrice || ''}
            onChange={(e) => setProduct({ ...product, lotPrice: e.target.value })}
            placeholder="Ex : 5"
          />
        </Form.Group>

        <Button
          className="mt-4 rounded-pill px-4"
          variant={editingProduct ? 'warning' : 'primary'}
          onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
        >
          {editingProduct ? 'Mettre à jour le produit' : 'Ajouter le produit'}
        </Button>
      </Form>

      <hr className="my-4" />

      {/* Liste des produits */}
      <Card.Title className="mt-4">📦 Produits existants</Card.Title>
      <Table responsive hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Prix</th>
            <th>Gros</th>
            <th>Réduc</th>
            <th>Catégorie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id || `${prod.name}-${Math.random()}`}>
              <td>{prod.image && <img src={prod.image} alt={prod.name} width="60" />}</td>
              <td>{prod.name}</td>
              <td><Badge bg="info">{prod.unitPrice} €</Badge></td>
              <td><Badge bg="warning">{prod.wholesalePrice} €</Badge></td>
              <td>{prod.reduction} %</td>
              <td>{prod.category}</td>
              <td>
                <Button size="sm" variant="outline-warning" onClick={() => handleEditProduct(prod)}>✏️</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteProduct(prod.id)}>🗑️</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>
  </Card>
)}


     

      {/* SECTION CATÉGORIES */}
      {showCategoryForm && (
  <Card className="admin-section mb-4">
    <Card.Body>
      <Card.Title className="admin-section-title">📂 Gérer les Catégories</Card.Title>

      {/* Formulaire de création */}
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
              <Button variant="success" type="submit">Ajouter</Button>
            </Col>
          </Row>
        </Form>
      )}

      {/* Formulaire de modification */}
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
                <Button variant="secondary" onClick={() => {
                  setEditingCategory(null);
                  setEditCategoryInput('');
                }}>
                  Annuler
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}

      {/* Liste des catégories */}
      <ul className="list-group list-group-flush">
        {categories.map((cat, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            {cat.name}
            <Button variant="outline-info" onClick={() => handleEditCategory(cat)} size="sm">✏️ Modifier</Button>
          </li>
        ))}
      </ul>
    </Card.Body>
  </Card>
)}

      {/* SECTION RECETTES */}
      {showRecipeForm && (
        <Card className="admin-section mb-4">
          <Card.Body>
            <Card.Title className="admin-section-title">🍲 Créer une Recette</Card.Title>
            <AdminRecipeForm />
          </Card.Body>
        </Card>
      )}

      {/* COMMANDES */}
      <Card className="admin-section mb-4">
        <Card.Body>
          <Card.Title className="admin-section-title">🧾 Commandes Reçues</Card.Title>
          <OrderList />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminPage;
