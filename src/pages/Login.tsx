import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import Alert from "../components/Alert";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Limpiar error antes de cada intento
    try {
      if (isRegister) {
        // Registro de usuario
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Inicio de sesión
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Create an Account" : "Login"}
        </h1>
        {error && <Alert type="error" message={error} />}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full mb-4">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p className="text-center">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <button
                className="link"
                onClick={() => setIsRegister(false)}
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                className="link"
                onClick={() => setIsRegister(true)}
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
