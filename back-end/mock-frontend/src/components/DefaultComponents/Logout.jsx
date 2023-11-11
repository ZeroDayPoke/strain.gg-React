import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store";
import userApi from "../../api/userApi";

function Logout() {
  const dispatch = useDispatch();
  const { id, favorites } = useSelector((state) => state.user) || {};
  console.log(id, favorites);
  const handleLogout = async () => {
    try {
      // Update favorites in the backend
      await userApi.updateFavorites(id, favorites);
      dispatch(removeUser());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default Logout;
