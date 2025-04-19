import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';


function AddProduct() {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prixParticulier, setPrixParticulier] = useState('');
  const [prixGros, setPrixGros] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour ajouter le produit
    console.log({ nom, description, prixParticulier, prixGros });
  };

  return (
    <div>
      <h2>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nom du produit"
          fullWidth
          margin="normal"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Prix particulier"
          type="number"
          fullWidth
          margin="normal"
          value={prixParticulier}
          onChange={(e) => setPrixParticulier(e.target.value)}
        />
        <TextField
          label="Prix de gros"
          type="number"
          fullWidth
          margin="normal"
          value={prixGros}
          onChange={(e) => setPrixGros(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Ajouter
        </Button>
      </form>
    </div>
  );
}

export default AddProduct;