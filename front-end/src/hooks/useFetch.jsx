// ./src/hooks/useFetch.jsx
import { useState, useEffect } from 'react';

export const useFetch = (fetchAction, params = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAction(params).then(setData).catch(setError).finally(() => setLoading(false));
  }, [fetchAction, params]);

  return [data, loading, error];
};
