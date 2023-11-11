import { Row, Col } from "react-bootstrap";
import { StrainCard } from "./StrainCard";

function StrainList({ strains, handleAddToFavorites, handleRemoveFromFavorites }) {
  return (
    <Row>
      {strains.map((strain) => (
        <Col sm={12} md={6} lg={4} key={strain.id}>
          <StrainCard
            strain={strain}
            handleAddToFavorites={handleAddToFavorites}
            handleRemoveFromFavorites={handleRemoveFromFavorites}
          />
        </Col>
      ))}
    </Row>
  );
}

import PropTypes from 'prop-types';

StrainList.propTypes = {
  strains: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  handleAddToFavorites: PropTypes.func.isRequired,
  handleRemoveFromFavorites: PropTypes.func.isRequired,
};

export default StrainList;
