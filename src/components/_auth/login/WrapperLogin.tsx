import { useState } from "react";
import ForgotLogin from "./resetForm/ForgotLogin";
import Login from "./loginForm/Login";

function WrapperLogin() {
  const [isChangeForm, setIsChangeForm] = useState(false);

  if (isChangeForm)
    return (
      <ForgotLogin
        setIsChangeForm={setIsChangeForm}
        isChangeForm={isChangeForm}
      />
    );

  if (!isChangeForm)
    return (
      <Login setIsChangeForm={setIsChangeForm} isChangeForm={isChangeForm} />
    );
}

export default WrapperLogin;
