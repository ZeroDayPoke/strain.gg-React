// StrainDetails

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import strainApi from "../../api/strainApi";
import { UpdateStrainForm } from ".";

function StrainDetails() {
  const [strain, setStrain] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const { strainId } = useParams();
  const id = parseInt(strainId);

  useEffect(() => {
    strainApi
      .get(strainId)
      .then((data) => setStrain(data))
      .catch((error) => console.error(error));
  }, [strainId]);

  const handleDelete = () => {
    strainApi
      .delete(strainId)
      .then(() => {
        console.log("Strain deleted");
        navigate("/strains");
      })
      .catch((error) => {
        console.error("Error deleting strain:", error);
      });
  };

  const handleUpdateClick = () => {
    setIsUpdating(!isUpdating);
  };

  if (!strain) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{strain.name}</h2>
      <p>{strain.subtype}</p>
      <p>{strain.thc_concentration}</p>
      <p>{strain.cbd_concentration}</p>
      <p>{strain.image_filename}</p>
      <img src={strain.image} alt={strain.name} />
      <button onClick={handleUpdateClick}>
        {isUpdating ? "Cancel Update" : "Update Strain"}
      </button>
      {isUpdating && <UpdateStrainForm strainId={id} />}
      <button onClick={handleDelete}>Delete Strain</button>
    </div>
  );
}

export default StrainDetails;
