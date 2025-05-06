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
    unit: '',
    wholesaleUnit: '',
    reduction: 0,
    lotQuantity: '',
    lotPrice: '',
    inStock: true, // 🟢 On ajoute ça
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
  const { name, unitPrice, wholesalePrice, category, image, unit, wholesaleUnit, reduction, lotPrice = '', lotQuantity = '', inStock } = product;

  if (name && unitPrice && wholesalePrice && category && unit && wholesaleUnit) {

    // Vérifie que la quantité et le prix du lot sont remplis ensemble ou laissés vides
    if ((lotPrice && !lotQuantity) || (!lotPrice && lotQuantity)) {
      return alert('Veuillez remplir à la fois la quantité et le prix du lot, ou laissez les deux vides.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('unitPrice', unitPrice);
    formData.append('wholesalePrice', wholesalePrice);
    formData.append('category', category);
    formData.append('unit', unit);  // Ajout de l'unité pour le prix particulier
    formData.append('wholesaleUnit', wholesaleUnit);  // Ajout du prix de gros
    formData.append('reduction', reduction);  // Ajout du champ réduction
    formData.append('inStock', inStock);  // Ajout de l'état de stock

    if (image) {
      formData.append('image', image);  // Si l'image existe
    }
    
    // Ajout conditionnel des données de lot
    if (lotQuantity) {
      formData.append('lotQuantity', lotQuantity);  // Si lotQuantity existe
    }
    if (lotPrice) {
      formData.append('lotPrice', lotPrice);  // Si lotPrice existe
    }
    
    try {
      const token = localStorage.getItem('token');  // Récupère le token
      if (!token) {
        alert('Token d\'authentification manquant');
        return;
      }
    
      const response = await fetch(`${API_URL}/admin/product`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Authentification
        },
        body: formData,
      });
    
      // Vérifie si la réponse est réussie (status 2xx)
      if (!response.ok) {
        // Log de la réponse pour aider à déboguer
        const errorText = await response.text();
        console.log('Erreur de serveur:', errorText);
        
        let errorMessage = 'Erreur serveur';
        try {
          // Essaye de parser le message d'erreur si la réponse est en JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Erreur serveur';
        } catch (e) {
          // Si la réponse n'est pas en JSON, utiliser un message générique
          console.error('Erreur lors du parsing de la réponse JSON', e);
        }
        alert(errorMessage);
        return;
      }
    
      // Si la réponse est OK, on parse la réponse JSON
      const responseData = await response.json();
      console.log('Réponse du serveur:', responseData);
    
      // Traitement de la réponse
      if (responseData && responseData.product) {
        setProducts([...products, responseData.product]);
        setProduct({
          name: '',
          unitPrice: '',
          wholesalePrice: '',
          category: '',
          image: null,
          unit: '',
          wholesaleUnit: '',
          reduction: 0,
          lotQuantity: '',     // Réinitialiser la quantité du lot
          lotPrice: '',        // Réinitialiser le prix du lot
          inStock: true,       // Réinitialiser l'état de stock à true (ou selon le besoin)
        });
      } else {
        alert('Produit créé avec succès, mais la réponse est invalide.');
      }
    
    } catch (error) {
      // Gère les erreurs réseau ou autres exceptions
      console.error('Erreur lors de la requête:', error);
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
    unit: prod.unit, // Ajout de l'unité pour le prix particulier
    wholesaleUnit: prod.wholesaleUnit, // Ajout de l'unité pour le prix de gros
    reduction: prod.reduction || 0, // Pré-remplissage du champ réduction (si aucune valeur, met 0)
    image: null, // L'image reste null ici, elle sera gérée via le champ de téléchargement d'image dans le formulaire
    lotQuantity: prod.lotQuantity || null,  // Si l'article a une quantité de lot, elle est pré-remplie
    lotPrice: prod.lotPrice || null, // Pré-remplissage du prix par lot si disponible
    inStock: prod.inStock || true, // Pré-remplissage de l'état de stock (par défaut, on met true si non défini)
  });
};



  

// Envoyer la mise à jour d'un produit existant
// Envoyer la mise à jour d'un produit existant
const handleUpdateProduct = async () => {
  const { name, unitPrice, wholesalePrice, category, unit, wholesaleUnit, reduction, image, lotQuantity, lotPrice, inStock } = product;

  if (name && unitPrice && wholesalePrice && category && unit && wholesaleUnit && editingProduct) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('unitPrice', unitPrice);
    formData.append('wholesalePrice', wholesalePrice);
    formData.append('category', category);
    formData.append('unit', unit); // Ajout de l'unité pour le prix particulier
    formData.append('wholesaleUnit', wholesaleUnit); // Ajout de l'unité pour le prix de gros
    formData.append('reduction', reduction); // Ajout du champ réduction
    formData.append('inStock', inStock); // Ajout de l'état de stock (inStock)
    if (image) formData.append('image', image); // Si l'image est présente, l'ajouter à la requête

    // Ajout des champs lotQuantity et lotPrice si présents
    if (lotQuantity) {
      formData.append('lotQuantity', lotQuantity);
    }
    if (lotPrice) {
      formData.append('lotPrice', lotPrice);
    }

    try {
      const token = localStorage.getItem('token');
    
      const response = await fetch(`${API_URL}/admin/product/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text(); // Log de la réponse brute en cas d'erreur
        console.error('Réponse erreur brute :', text);
        throw new Error(`Erreur ${response.status}: ${text}`);
      }
    
      const updated = await response.json(); // On parse la réponse en JSON pour récupérer le produit mis à jour
    
      const updatedList = products.map((p) =>
        p.id === updated.product.id ? updated.product : p // Remplace le produit dans la liste
      );
      setProducts(updatedList); // Met à jour l'état avec le produit mis à jour
      setEditingProduct(null); // Fin de l'édition
      setProduct({
        name: '', 
        unitPrice: '', 
        wholesalePrice: '', 
        category: '', 
        unit: '', 
        wholesaleUnit: '', 
        reduction: 0, 
        image: null, 
        lotQuantity: '', 
        lotPrice: '',
        inStock: true, // Réinitialisation de l'état de stock (peut être modifié en fonction de ton besoin)
      }); // Réinitialisation des champs du formulaire

    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      alert(error.message); // Affiche un message d'erreur en cas de problème
    }
  } else {
    alert('Veuillez remplir tous les champs obligatoires.');
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
    <PopupUploader/>
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
                <Form.Label>Unité de mesure (prix unitaire)</Form.Label>
                <Form.Control
                  type="text"
                  value={product.unit}
                  onChange={(e) => setProduct({ ...product, unit: e.target.value })}
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
                <Form.Label>Unité de mesure (prix de gros)</Form.Label>
                <Form.Control
                  type="text"
                  value={product.wholesaleUnit}
                  onChange={(e) => setProduct({ ...product, wholesaleUnit: e.target.value })}
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
          <Form.Group controlId="formInStock">
  <Form.Check
    type="checkbox"
    label="Produit en stock"
    checked={product.inStock}
    onChange={(e) =>
      setProduct({ ...product, inStock: e.target.checked })
    }
  />
</Form.Group>

          {/* Champ pour la réduction */}
          <Form.Group>
            <Form.Label>Réduction (%)</Form.Label>
            <Form.Control
              type="number"
              value={product.reduction}
              onChange={(e) => setProduct({ ...product, reduction: e.target.value })}
              placeholder="Ex : 10"
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
        {/* Champs optionnels pour le prix par lot */}
<Form.Group className="mt-3">
  <Form.Label>🎯 Quantité du lot (optionnel)</Form.Label>
  <Form.Control
    type="number"
    value={product.lotQuantity || ''}
    onChange={(e) => setProduct({ ...product, lotQuantity: e.target.value })}
    placeholder="Ex : 3"
  />
</Form.Group>
<Form.Group className="mt-2">
  <Form.Label>💰 Prix du lot (optionnel)</Form.Label>
  <Form.Control
    type="number"
    value={product.lotPrice || ''}
    onChange={(e) => setProduct({ ...product, lotPrice: e.target.value })}
    placeholder="Ex : 5"
  />
</Form.Group>

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
              <th>Réduction</th> {/* Nouvelle colonne */}
              <th>Catégorie</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id || `${prod.name}-${Math.random()}`}>
                <td>
                  {prod.image && (
                    <img src={prod.image} alt={prod.name} width="70" className="rounded shadow-sm" />
                  )}
                </td>
                <td>{prod.name}</td>
                <td><Badge bg="info">{prod.unitPrice} €</Badge></td>
                <td><Badge bg="warning">{prod.wholesalePrice} €</Badge></td>
                <td>{prod.reduction} %</td> {/* Affichage de la réduction */}
                <td>
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

<AdminRecipeForm />
      
    {/* Section : Commandes reçues */}
    <Card className="admin-section mb-4">
      <Card.Body>
        <Card.Title className="admin-section-title">🧾 Commandes reçues</Card.Title>
        <OrderList />
      </Card.Body>
    </Card>

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
                variant="outline-info"
                onClick={() => handleEditCategory(cat)}
                size="sm"
              >
                Modifier
              </Button>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  </Container>
);


};

export default AdminPage;
