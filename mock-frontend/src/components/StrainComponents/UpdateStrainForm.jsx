import { useState, useEffect } from "react";
import strainApi from "../../api/strainApi";

function UpdateStrainForm({ strainId }) {
  const [name, setName] = useState("");
  const [subtype, setSubtype] = useState("");
  const [thcConcentration, setThcConcentration] = useState("");
  const [cbdConcentration, setCbdConcentration] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    strainApi
      .get(strainId)
      .then((strain) => {
        setName(strain.name);
        setSubtype(strain.subtype);
        setThcConcentration(strain.thc_concentration);
        setCbdConcentration(strain.cbd_concentration);
      })
      .catch((error) => console.error(error));
  }, [strainId]);

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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("subtype", subtype);
    formData.append("thc_concentration", thcConcentration);
    formData.append("cbd_concentration", cbdConcentration);
    if (image) {
      formData.append("image", image);
    }

    strainApi
      .update(strainId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        console.log("Strain updated:", response);
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
      <h2>Update Strain</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name && <p>{errors.name}</p>}
        </label>
        <label>
          Subtype:
          <select value={subtype} onChange={(event) => setSubtype(event.target.value)}>
            <option value="Indica">Indica</option>
            <option value="Sativa">Sativa</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Unknown">Unknown</option>
          </select>
          {errors.subtype && <p>{errors.subtype}</p>}
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
        <button type="submit">Update Strain</button>
      </form>
    </div>
  );
}

import PropTypes from 'prop-types';

UpdateStrainForm.propTypes = {
  strainId: PropTypes.number,
};

export default UpdateStrainForm;
