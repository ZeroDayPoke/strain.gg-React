// Stores.jsx

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFetch } from "../../hooks/useFetch";
import storeApi from "../../api/storeApi";
import { StoreList, StoreFilterForm } from "../StoreComponents";

function Stores() {
  const userRoles = useSelector(state => state.user.roles);
  const [allStores, allStoresLoading, allStoresError] = useFetch(storeApi.get);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    setStores(allStores);
  }, [allStores]);

  useEffect(() => {
    let filteredStores = allStores;

    if (filters.name) {
      filteredStores = filteredStores.filter(store =>
        store.name && store.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.location) {
      filteredStores = filteredStores.filter(store =>
        store.location && store.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.description) {
      filteredStores = filteredStores.filter(store =>
        store.description && store.description.toLowerCase().includes(filters.description.toLowerCase())
      );
    }

    setStores(filteredStores);
  }, [filters, allStores]);

  if (allStoresLoading) {
    return <div>Loading...</div>;
  }

  if (allStoresError) {
    return <div>Error: {allStoresError?.message}</div>;
  }

  const handleFilterChange = (event) => {
    let { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Stores</h2>
      <StoreFilterForm filters={filters} handleFilterChange={handleFilterChange} />
      <StoreList stores={stores} />
    </div>
  );
}

export default Stores;
