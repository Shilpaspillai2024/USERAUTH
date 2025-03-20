import React, { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/api";
import { Eye, EyeOff } from "lucide-react";

interface ValidationErrors {
  email?: string;
  password?: string;
}

const Login: React.FC<{ setIsAuthenticated: (value: boolean) => void }> = ({
  setIsAuthenticated,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [validateError, setValidateError] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidateError({ ...validateError, [e.target.name]: undefined });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setValidateError(newErrors);
    return isValid;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await loginUser({ email, password });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          setIsAuthenticated(true);
          navigate("/dashboard");
        }
      } catch (err) {
        setError("Invalid credentials");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={onChange}
              className={validateError.email ? "input-error" : ""}
            />
            {validateError.email && (
              <div className="field-error">{validateError.email}</div>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                name="password"
                value={password}
                onChange={onChange}
                className={validateError.password ? "input-error" : ""}
              />
              <span
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          {validateError.password && (
            <div className="field-error">{validateError.password}</div>
          )}
          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
