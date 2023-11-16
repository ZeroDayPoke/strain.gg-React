// ./src/components/AssociationForm.jsx

import { Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";

function AssociationForm({ strains, stores, selectedStrain, setSelectedStrain, selectedStore, setSelectedStore, handleAssociation }) {
  return (
    <Form onSubmit={handleAssociation}>
      <Form.Group controlId="formStrain">
        <Form.Label>Select Strain</Form.Label>
        <Form.Control
          as="select"
          value={selectedStrain}
          onChange={(e) => setSelectedStrain(e.target.value)}
        >
          {strains.map((strain) => (
            <option key={strain.id} value={strain.id}>
              {strain.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formStore">
        <Form.Label>Select Store</Form.Label>
        <Form.Control
          as="select"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Associate
      </Button>
    </Form>
  );
}

AssociationForm.propTypes = {
  strains: PropTypes.array.isRequired,
  stores: PropTypes.array.isRequired,
  selectedStrain: PropTypes.string.isRequired,
  setSelectedStrain: PropTypes.func.isRequired,
  selectedStore: PropTypes.string.isRequired,
  setSelectedStore: PropTypes.func.isRequired,
  handleAssociation: PropTypes.func.isRequired,
};

export default AssociationForm;
