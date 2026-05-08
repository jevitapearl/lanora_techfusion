import {useState} from "react";
import { Link,useNavigate } from "react-router-dom"
import { Terminal } from "lucide-react"

export default function Register() {

  const Port="http://localhost:5000/register";

  const [form, setForm]= useState({
    username:"",
    email:"",
    password:""
  });
  
  const [error, setError]=useState("");
  const[success, setSuccess]=useState("");

  const navigate=useNavigate();

  const handleChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("Creating your Account...");

    try{
      const res = await fetch(Port,{
        method: "POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({
          username:form.username,
          email: form.email,
          password: form.password
        })
      });

      const data =await res.json() ;

      if (!res.ok){
        setError(data.message || "Registration failed");
        setSuccess("");
        return;
      }
      setSuccess("Account Created Successfully! Please return to CLI or Login")
      
      if (!localStorage.getItem("joinDate")) {
        localStorage.setItem("joinDate", new Date().toISOString());
      }

     
    
    }catch(err){
      setError("Server error");
      setSuccess("");
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
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Register to connect your CLI and access your dashboard</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-card border border-border p-6 rounded-xl shadow-xl space-y-4"
        >

       
         <div className="space-y-2">
            <label>Name</label>
            <input 
              type="text" 
              name="username"
              value={form.username}
              onChange={handleChange} 
              placeholder="Developer" 
              className="h-10 w-full rounded-md border px-3"
            />
          </div> 

          <div className="space-y-2">
            <label>Email</label>
            <input 
              type="email"
              name="email"  
              value={form.email}
               onChange={handleChange}
              placeholder="name@example.com" 
              className="h-10 w-full rounded-md border px-3"
            />
          </div>


          <div className="space-y-2">
            <label >Password </label>
            <input 
              type="password" 
              name="password"
              value={form.password}
              onChange={handleChange}
              className="h-10 w-full rounded-md border px-3"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          
          <button type="submit"
          className="w-full bg-emerald-400 text-black h-10 rounded-md font-semibold cursor-pointer"
          >  Register for Free
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
