import { InputGroup, Form } from "react-bootstrap";

function FilterForm({ filters, handleFilterChange }) {
  return (
    <Form>
      <InputGroup className="mb-3">
        <InputGroup.Text id="name-addon">Name</InputGroup.Text>
        <Form.Control
          name="name"
          placeholder="Store name"
          aria-label="Store name"
          aria-describedby="name-addon"
          value={filters.name}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="location-addon">Location</InputGroup.Text>
        <Form.Control
          name="location"
          placeholder="Location"
          aria-label="Location"
          aria-describedby="location-addon"
          value={filters.location}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="phone-addon">Phone</InputGroup.Text>
        <Form.Control
          name="phone"
          placeholder="Phone"
          aria-label="Phone"
          aria-describedby="phone-addon"
          value={filters.phone}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="email-addon">Email</InputGroup.Text>
        <Form.Control
          name="email"
          placeholder="Email"
          aria-label="Email"
          aria-describedby="email-addon"
          value={filters.email}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="description-addon">Description</InputGroup.Text>
        <Form.Control
          name="description"
          placeholder="Description"
          aria-label="Description"
          aria-describedby="description-addon"
          value={filters.description}
          onChange={handleFilterChange}
        />
      </InputGroup>
    </Form>
  );
}

import PropTypes from 'prop-types';

FilterForm.propTypes = {
  filters: PropTypes.shape({
    name: PropTypes.string,
    location: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    description: PropTypes.string,
  }),
  handleFilterChange: PropTypes.func.isRequired,
};

export default FilterForm;
