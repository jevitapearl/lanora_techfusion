import {useState} from "react";
import { Link,useNavigate } from "react-router-dom"
import { Terminal } from "lucide-react"

export default function Login() {

  const LoginPort="http://localhost:5000/login";
  
  const [form, setForm]=useState({
    email:"",
    password:""
  });

  const [error, setError] = useState("");
  const navigate= useNavigate();

  const handleChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try{
      const res=await fetch (LoginPort ,{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email:form.email,
          password: form.password
        })
      });

      const data= await res.json();

      if (!res.ok){
        setError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);
      
      const username = data.username || (data.user && data.user.username) || "Developer";
      const email = data.email || (data.user && data.user.email) || form.email;
      
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);

      if (!localStorage.getItem("joinDate")) {
        localStorage.setItem("joinDate", new Date().toISOString());
      }
      navigate("/dashboard");
    } catch(err){
      setError("server error");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-secondary rounded-xl border border-border">
              <Terminal className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">LANORA</h1>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back!!</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-xl shadow-xl space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
              Email
            </label>
            <input 
              type="email"
              name="email" 
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com" 
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              value={form.password}
              onChange={handleChange} 
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button type="submit" className="w-full bg-emerald-400 text-black h-10 rounded-md font-semibold cursor-pointer">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-foreground hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
