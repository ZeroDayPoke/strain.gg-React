import { Row, Col } from "react-bootstrap";
import StoreCard from "./StoreCard";
import PropTypes from "prop-types";

function StoreList({ stores }) {
  return (
    <Row>
      {stores.map((store) => (
        <Col sm={12} md={6} lg={4} key={store.id}>
          <StoreCard store={store} />
        </Col>
      ))}
    </Row>
  );
}

StoreList.propTypes = {
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default StoreList;
