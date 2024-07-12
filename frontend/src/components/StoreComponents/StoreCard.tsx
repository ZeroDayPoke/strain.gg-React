// StoreCard.jsx is a component that renders a card for a store

import { Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import storeApi from "../../api/storeApi";

export function StoreCard({ store }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleImageSelect = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleUpload = (event) => {
    event.preventDefault();

    // Initialize a new FormData instance
    const formData = new FormData();

    // Append the image file to the form data
    formData.append("image", selectedImage);

    // Call the API's update method to upload the image
    storeApi
      .update(store.id, formData)
      .then(() => {
        console.log("Image uploaded successfully");
        handleClose();
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  return (
    <Card className="mb-4">
      {store.image_filename ? (
        <Card.Img
          variant="top"
          src={`http://localhost:3100/public/images/${store.image_filename}`}
        />
      ) : (
        <Button variant="primary" onClick={handleShow}>
          Upload Image
        </Button>
      )}
      <Card.Body>
        <Card.Title>{store.name}</Card.Title>
        <Card.Text>
          Location: {store.location}
          <br />
          Phone: {store.phone}
          <br />
          Email: {store.email}
          <br />
          Description: {store.description}
        </Card.Text>
        <Link to={`/stores/${store.id}`}>
          <Button variant="primary">More details</Button>
        </Link>
      </Card.Body>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group controlId="formFile">
              <Form.Label>Choose Image</Form.Label>
              <Form.Control type="file" onChange={handleImageSelect} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Upload
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

StoreCard.propTypes = {
  store: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    phone: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
    image_filename: PropTypes.string,
  }).isRequired,
};

export default StoreCard;
