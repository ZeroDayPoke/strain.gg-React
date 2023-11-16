// AddStrainForm.jsx

import strainApi from "../../api/strainApi";
import { useState } from "react";
import { useSelector } from "react-redux";

function AddStrainForm() {
  const [name, setName] = useState("");
  const [subtype, setSubtype] = useState("");
  const [thcConcentration, setThcConcentration] = useState("");
  const [cbdConcentration, setCbdConcentration] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const userId = useSelector(state => state.user.userId);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic form validation
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = "Name is required";
    }

    if (!subtype.trim()) {
      validationErrors.subtype = "Subtype is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newStrain = new FormData();
    newStrain.append("name", name);
    newStrain.append("subtype", subtype);
    newStrain.append("thc_concentration", thcConcentration);
    newStrain.append("cbd_concentration", cbdConcentration);
    if (image) {
      newStrain.append("image", image);
    }

    console.log("New strain:", newStrain);

    strainApi
      .create(newStrain, userId, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("New strain added:", response.data);
        // Reset the form
        setName("");
        setSubtype("");
        setThcConcentration("");
        setCbdConcentration("");
        setImage(null);
        setErrors({});
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Add Strain</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Subtype:
          <input
            type="text"
            value={subtype}
            onChange={(event) => setSubtype(event.target.value)}
          />
        </label>
        <label>
          THC Concentration:
          <input
            type="text"
            value={thcConcentration}
            onChange={(event) => setThcConcentration(event.target.value)}
          />
        </label>
        <label>
          CBD Concentration:
          <input
            type="text"
            value={cbdConcentration}
            onChange={(event) => setCbdConcentration(event.target.value)}
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            onChange={(event) => setImage(event.target.files[0])}
          />
        </label>
        <button type="submit">Add Strain</button>
      </form>
    </div>
  );
}

export default AddStrainForm;
