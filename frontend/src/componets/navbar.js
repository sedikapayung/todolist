import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate();
  const logout = async()=>{
    try {
      await axios.delete('http://localhost:3001/logout')
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  const handlejobs =()=>{
    navigate('/addjobs')
  }
  return (
   <nav className="navbar" role="navigation" aria-label="main navigation">
    <div className="container mt-5">
     <div className="navbar-brand">
       <a className="navbar-item" href="https://bulma.io">
         <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28" alt='logo'/>
       </a>
   
       <a href="/"role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
         <span aria-hidden="true"></span>
         <span aria-hidden="true"></span>
         <span aria-hidden="true"></span>
       </a>
     </div>
    
     <div id="navbarBasicExample" className="navbar-menu">
       <div className="navbar-start">
         <a href='/' className="navbar-item">
           Home
         </a>
         <a onClick={handlejobs} className="navbar-item">
           Addjobs
         </a>
   
    
   
         
       </div>
   
       <div className="navbar-end">
         <div className="navbar-item">
           <div className="buttons">
             <button onClick={logout} className="button is-light">Log out</button>
             
           </div>
         </div>
       </div>
     </div>
     </div>
   </nav>
  )
}

export default Navbar
