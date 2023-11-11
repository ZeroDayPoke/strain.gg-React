import { InputGroup, Form } from "react-bootstrap";

function FilterForm({ filters, handleFilterChange }) {
  return (
    <Form>
      <InputGroup className="mb-3">
        <InputGroup.Text id="name-addon">Name</InputGroup.Text>
        <Form.Control
          name="name"
          placeholder="Strain name"
          aria-label="Strain name"
          aria-describedby="name-addon"
          value={filters.name}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="subtype-addon">Subtype</InputGroup.Text>
        <Form.Select
          name="subtype"
          aria-label="Strain subtype"
          aria-describedby="subtype-addon"
          value={filters.subtype}
          onChange={handleFilterChange}
        >
          <option value="">All</option>
          <option value="Indica">Indica</option>
          <option value="Sativa">Sativa</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Unknown">Unknown</option>
        </Form.Select>
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="min-thc-addon">
          Min THC Concentration
        </InputGroup.Text>
        <Form.Control
          name="min_thc_concentration"
          placeholder="Minimum THC Concentration"
          aria-label="Minimum THC Concentration"
          aria-describedby="min-thc-addon"
          value={filters.min_thc_concentration}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="min-cbd-addon">
          Min CBD Concentration
        </InputGroup.Text>
        <Form.Control
          name="min_cbd_concentration"
          placeholder="Minimum CBD Concentration"
          aria-label="Minimum CBD Concentration"
          aria-describedby="min-cbd-addon"
          value={filters.min_cbd_concentration}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="date-added-addon">Date Added</InputGroup.Text>
        <Form.Control
          type="date"
          name="date_added"
          placeholder="Date Added"
          aria-label="Date Added"
          aria-describedby="date-added-addon"
          value={filters.date_added}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="grower-addon">Grower</InputGroup.Text>
        <Form.Control
          name="grower"
          placeholder="Grower"
          aria-label="Grower"
          aria-describedby="grower-addon"
          value={filters.grower.name}
          onChange={handleFilterChange}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="store-addon">Store</InputGroup.Text>
        <Form.Control
          name="store"
          placeholder="Store"
          aria-label="Store"
          aria-describedby="store-addon"
          value={filters.store.name}
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
    subtype: PropTypes.string,
    min_thc_concentration: PropTypes.string,
    min_cbd_concentration: PropTypes.string,
    date_added: PropTypes.string,
    grower: PropTypes.string,
    store: PropTypes.string,
  }),
  handleFilterChange: PropTypes.func.isRequired,
};

export default FilterForm;
