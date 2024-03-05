import React ,{ useState } from 'react'
import axios from 'axios'
import {useNavigate}from 'react-router-dom'

const Register = () => {

    const [name,setName] = useState('');
    const [username,setUsername] = useState('');
    const [password, setPassword]=useState('');
    const [confpassword,setconfPassword] = useState('')
    const[msg,setMsg] = useState() 
    const  navigate=useNavigate();
const Register = async (e)=>{
  e.preventDefault();
  try {
    await axios.post('http://localhost:3001/api/register',{
      Name : name,
      Username:username,
      Password:password,
      confPassword:confpassword
    })
    navigate("/login")
  } catch (error) {
  if (error.response){
      setMsg(error.response.data.msg)
  }
  }
}


  return (
    <section className="hero has-background-grey-light is-fullheight is-fullwidth">
      <div className="hero-body">
        <div className="container">
            <div className="columns is-centered" >
                <div className="column is-4-desktop">
                    <form onSubmit={Register}className='box'>
                    <div className="field">
                                <label className="label">Name</label>
                                <div className="controls">
                                    <input type="text" className="input" placeholder='Name' value={name} onChange={(e)=> setName(e.target.value)}/>
                                </div>
                        </div>
                        <div className="field">
                                <label className="label">username </label>
                                <div className="controls">
                                    <input type="text" className="input" placeholder='Username' value={username} onChange={(e)=>{setUsername(e.target.value);}}/>
                                </div>
                        </div>
                        <div className="field">
                                <label className="label">Password</label>
                                <div className="controls">
                                    <input type="password" className="input" placeholder='********' value={password} onChange={(e)=> {setPassword(e.target.value)}}/>
                                </div>
                                <p>{ msg }</p>
                        </div>
                        <div className="field">
                                <label className="label">confPassword</label>
                                <div className="controls">
                                    <input type="password" className="input" placeholder='********' value={confpassword} onChange={(e) =>{setconfPassword(e.target.value)}}/>
                                </div>
                        </div>
                        
                        <div className="field">
                                <button className="button is-success is-fullwidth">Register</button>
                        </div>
                    </form>
                </div>
            </div>
          
        </div>
      </div>
    </section>
  )
}

export default Register
