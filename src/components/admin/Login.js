import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../../firebase-config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    console.log(user)
    if (user) navigate("/");
  }, [user, loading, navigate])

  return (
    <div className='container bg-grey tab-content' style={{ width: 300, maxWidth: 300, marginTop: 50 }}>
      <h2 style={{ textAlign: "center", fontSize: 20 }}>Login</h2>
      <div className="form-outline mb-4 ">
        <input
          type="email"
          className="form-control"
          placeholder="E-mail Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-outline mb-4">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>

      <div className="form-outline mb-4">
        <button
          style={{ color: "#fff", backgroundColor: "#ff5964" }}
          className="btn btn-default"
          onClick={() => logInWithEmailAndPassword(email, password)}>
          Login
        </button>
      </div>
    </div >
  )
}

export default Login