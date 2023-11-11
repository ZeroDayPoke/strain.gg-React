import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useFavorites } from "../../hooks/useFavorites";
import { useFetch } from "../../hooks/useFetch";
import strainApi from "../../api/strainApi";
import storeApi from "../../api/storeApi";
import AssociationForm from "../AssociationForm";
import { AddStrainForm, FilterForm, StrainList } from "../StrainComponents";

function Strains() {
  const userRoles = useSelector((state) => state.user.roles);
  const { handleAddToFavorites, handleRemoveFromFavorites } = useFavorites();
  const { loading: favoritesLoading } = useFavorites();

  const [allStrains, allStrainsLoading, allStrainsError] = useFetch(
    strainApi.get
  );
  const [stores, storesLoading, storesError] = useFetch(storeApi.get);
  const [selectedStrain, setSelectedStrain] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [filters, setFilters] = useState({
    name: "",
    subtype: "",
    min_thc_concentration: "",
    min_cbd_concentration: "",
    date_added: "",
    grower: "",
    store: "",
  });
  const [strains, setStrains] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setStrains(allStrains);
  }, [allStrains]);

  useEffect(() => {
    let filteredStrains = allStrains;

    if (filters.name) {
      filteredStrains = filteredStrains.filter(
        (strain) =>
          strain.name &&
          strain.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.subtype) {
      filteredStrains = filteredStrains.filter(
        (strain) =>
          strain.subtype &&
          strain.subtype.toLowerCase() === filters.subtype.toLowerCase()
      );
    }

    if (filters.min_thc_concentration) {
      filteredStrains = filteredStrains.filter(
        (strain) =>
          strain.thc_concentration &&
          strain.thc_concentration >= filters.min_thc_concentration
      );
    }

    if (filters.min_cbd_concentration) {
      filteredStrains = filteredStrains.filter(
        (strain) =>
          strain.cbd_concentration &&
          strain.cbd_concentration >= filters.min_cbd_concentration
      );
    }

    if (filters.date_added) {
      filteredStrains = filteredStrains.filter(
        (strain) =>
          strain.date_added &&
          new Date(strain.date_added) >= new Date(filters.date_added)
      );
    }

    if (filters.grower) {
      filteredStrains = filteredStrains.filter(
        (strain) =>
          strain.grower &&
          strain.grower.toLowerCase().includes(filters.grower.toLowerCase())
      );
    }

    if (filters.store) {
      filteredStrains = filteredStrains.filter(
        (strain) =>
          strain.store &&
          strain.store.toLowerCase().includes(filters.store.toLowerCase())
      );
    }

    setStrains(filteredStrains);
  }, [filters, allStrains]);

  if (allStrainsLoading || storesLoading) {
    return <div>Loading...</div>;
  }

  if (allStrainsError || storesError) {
    return <div>Error: {allStrainsError?.message || storesError?.message}</div>;
  }

  const handleFilterChange = (event) => {
    let { name, value } = event.target;

    // Validate date if the filter is 'date_added'
    if (name === "date_added" && value) {
      let date = new Date(value);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        alert("Invalid date. Please enter a date in the format YYYY-MM-DD.");
        return;
      }
      // Format date to YYYY-MM-DD for the backend
      value = date.toISOString().split("T")[0];
    }

    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleAssociation = (event) => {
    event.preventDefault();

    if (!selectedStrain || !selectedStore) {
      alert("Please select both a strain and a store.");
      return;
    }

    strainApi
      .associateWithStore(selectedStrain, selectedStore)
      .then(() => {
        alert("Association created");
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (allStrainsLoading || storesLoading || favoritesLoading) {
    return <div>Loading...</div>;
  }

  if (allStrainsError || storesError) {
    return <div>Error: {allStrainsError?.message || storesError?.message}</div>;
  }

  return (
    <Container>
      <h2>Strains</h2>
      {(userRoles.includes("CLOUD_CHASER") ||
        userRoles.includes("CLOUD_CULTIVATOR")) && <AddStrainForm />}
      <AssociationForm
        strains={strains}
        stores={stores}
        selectedStrain={selectedStrain}
        setSelectedStrain={setSelectedStrain}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        handleAssociation={handleAssociation}
      />
      <FilterForm filters={filters} handleFilterChange={handleFilterChange} />
      <StrainList
        strains={strains}
        handleAddToFavorites={handleAddToFavorites}
        handleRemoveFromFavorites={handleRemoveFromFavorites}
      />
    </Container>
  );
}

export default Strains;
