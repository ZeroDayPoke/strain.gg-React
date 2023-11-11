import { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useFavorites } from "../../hooks/useFavorites";
import userApi from "../../api/userApi";

const AccountPage = () => {
  const { handleRemoveFromFavorites } = useFavorites();
  const [resettingPassword, setResettingPassword] = useState(false);

  const { email, favorites } = useSelector((state) => state.user) || {};

  const handlePasswordResetRequest = async (event) => {
    event.preventDefault();
    setResettingPassword(true);
    try {
      await userApi.requestResetPassword(email);
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Failed to request password reset:", error);
    } finally {
      setResettingPassword(false);
    }
  };

  const handleRemove = async (strainId) => {
    try {
      await handleRemoveFromFavorites(strainId);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Your Account</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Favorite Strains
        </Card.Subtitle>
        {favorites && favorites.length > 0 ? (
          <ListGroup variant="flush">
            {favorites.map((strainId, index) => (
              <ListGroup.Item key={index}>
                {strainId}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemove(strainId)}
                >
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No favorite strains found.</p>
        )}
        <Button
          variant="primary"
          disabled={resettingPassword}
          onClick={handlePasswordResetRequest}
        >
          {resettingPassword ? "Sending..." : "Reset Password"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default AccountPage;
