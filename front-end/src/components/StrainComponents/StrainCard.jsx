import { Card, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useState } from "react";
import strainApi from "../../api/strainApi";

export function StrainCard({
  strain,
  handleAddToFavorites,
  handleRemoveFromFavorites,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const favorites = useSelector((state) => state.user.favorites);

  const isFavorite = (strainId) =>
    favorites ? favorites.includes(strainId) : false;
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
    strainApi
      .update(strain.id, formData)
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
      {strain.image_filename ? (
        <Card.Img
          variant="top"
          src={`http://localhost:3100/public/images/${strain.image_filename}`}
        />
      ) : (
        <Button variant="primary" onClick={handleShow}>
          Upload Image
        </Button>
      )}
      <Card.Body>
        <Card.Title>{strain.name}</Card.Title>
        <Card.Text>
          Subtype: {strain.subtype}
          <br />
          THC Concentration: {strain.thc_concentration}
          <br />
          CBD Concentration: {strain.cbd_concentration}
        </Card.Text>
        {isFavorite(strain.id) ? (
          <Button
            variant="primary"
            onClick={() => handleRemoveFromFavorites(strain.id)}
          >
            Remove from Favorites
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => handleAddToFavorites(strain.id)}
          >
            Add to Favorites
          </Button>
        )}
        <Link to={`/strains/${strain.id}`}>
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

StrainCard.propTypes = {
  strain: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    subtype: PropTypes.string.isRequired,
    thc_concentration: PropTypes.number.isRequired,
    cbd_concentration: PropTypes.number.isRequired,
    image_filename: PropTypes.string,
  }).isRequired,
  handleAddToFavorites: PropTypes.func.isRequired,
  handleRemoveFromFavorites: PropTypes.func.isRequired,
};

export default StrainCard;
