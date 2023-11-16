// ./src/components/StoreDetails.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import storeApi from "../../api/storeApi";
import UpdateStoreForm from "./UpdateStoreForm";

function StoreDetails() {
  const [store, setStore] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const userRoles = useSelector(state => state.user.roles);
  const { storeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("StoreDetails useEffect called with id:", storeId);
    storeApi
      .get(storeId)
      .then((data) => {
        console.log("Store data received:", data);
        setStore(data);
      })
      .catch((error) => {
        console.error("Error fetching store:", error);
      });
  }, [storeId]);

  const handleDelete = () => {
    storeApi
      .delete(storeId)
      .then(() => {
        console.log("Store deleted");
        navigate("/stores");
      })
      .catch((error) => {
        console.error("Error deleting store:", error);
      });
  };

  const handleUpdateClick = () => {
    setIsUpdating(!isUpdating);
  };

  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Store Details</h2>
      <p>Name: {store.name}</p>
      <p>Location: {store.location}</p>
      <p>Phone: {store.phone}</p>
      <p>Email: {store.email}</p>
      <p>Description: {store.description}</p>
      {(userRoles.includes("CLOUD_CARRIER") ||
        userRoles.includes("CLOUD_CHASER")) && (
        <div>
          <h3>Update Store</h3>
          <button onClick={handleUpdateClick}>
            {isUpdating ? "Cancel Update" : "Update Store"}
          </button>
          {isUpdating && <UpdateStoreForm storeId={storeId} />}
          <button onClick={handleDelete}>Delete Store</button>
        </div>
      )}
    </div>
  );
}

export default StoreDetails;
