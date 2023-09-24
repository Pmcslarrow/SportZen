// errorHandling.js
export const handleError = (setError, setMessage, err) => {
  const errorCode = err.code;

  switch (errorCode) {
    case "auth/email-already-in-use":
      setMessage("Email is already in use. Please choose another email.");
      break;
    case "auth/weak-password":
      setMessage("Password is too weak. Please choose a stronger password.");
      break;
    default:
      setMessage("An error occurred during registration. Please try again later.");
      break;
  }

  setError(true);
};
