// ./src/components/ResetPasswordForm.js

import { useLocation } from 'react-router-dom';
import { useState } from "react";
import userApi from '../../api/userApi';

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  const token = query.get("token");

  const submitForm = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await userApi.resetPassword(token, password);
      alert("Password has been reset. You may now log in with your new password.");
    } catch (error) {
      alert("Failed to reset password. Please ensure your token is correct and try again.");
    }
  };

  return (
    <form onSubmit={submitForm}>
      <label>
        New Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <label>
        Confirm Password:
        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default ResetPasswordForm;
