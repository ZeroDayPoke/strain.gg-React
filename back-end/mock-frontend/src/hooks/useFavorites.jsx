import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import userApi from "../api/userApi";
import { setFavorites, addToFavorites, removeFromFavorites } from "../store";

export const useFavorites = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const favorites = useSelector((state) => state.user?.favorites);
  const userId = useSelector((state) => state.user.id);
  const dispatch = useDispatch();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await userApi.getFavorites(userId);
      dispatch(setFavorites(response.data));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (strainId) => {
    if (!userId) return;
    try {
      setLoading(true);
      await userApi.addToFavorites(userId, strainId);
      dispatch(addToFavorites(strainId));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (strainId) => {
    if (!userId) return;
    try {
      setLoading(true);
      await userApi.removeFromFavorites(userId, strainId);
      dispatch(removeFromFavorites(strainId));
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (strainId) => favorites?.includes(strainId);

  return {
    favorites,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    isFavorite,
    error,
    loading,
  };
};
