import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const CreateCategoryButton = ({ onAddCategory }) => {
  const [show, setShow] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      setCategoryName('');
      handleClose();
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Ajouter une catégorie
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Nouvelle Catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="categoryName">
              <Form.Label>Nom de la catégorie</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom de la catégorie"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateCategoryButton;
