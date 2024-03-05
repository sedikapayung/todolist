  import React ,{useState}from 'react'
  import axios from 'axios';
  import {useNavigate} from 'react-router-dom';


  const Login = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword]= useState('');
    const[usernameMsg,setUsernameMsg]= useState('');
    const[passwordMsg,setPasswordMsg]= useState('');
    const navigate = useNavigate();
    const LOGIN = async(e)=>{
      e.preventDefault()
      try {
        await axios.post ('http://localhost:3001/api/login',{
          Username:username,
          Password:password
        })
        navigate('/dasboard') 
      } catch (error) {
        if(error.response.data.msg === 'Username Not Found'){
          setUsernameMsg(error.response.data.msg)
          setPasswordMsg('');
        }else if (error.response.data.msg==='wrong Password'){
          setPasswordMsg(error.response.data.msg)
          setUsernameMsg('')
        }
      }
    }
    return (
      <section className="hero has-background-grey-light is-fullheight is-fullwidth">
        <div className="hero-body">
          <div className="container">
              <div className="columns is-centered" >
                  <div className="column is-4-desktop">
                      <form onSubmit={LOGIN} className='box'>
                          <div className="field">
                                  <label className="label">username </label>
                                  <div className="controls">
                                      <input type="text" className="input" placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)} />
                                  <p>{usernameMsg}</p>
                                  </div>
                          </div> 
                          <div className="field">
                                  <label className="label">Password</label>
                                  <div className="controls">
                                      <input type="password" className="input" placeholder='********' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                  </div>
                                  <p>{passwordMsg}</p>
                          </div>
                          <div className="field">
                                  <button className="button is-success is-fullwidth">login</button>
                          </div>
                          
                      </form>
                      
                  </div>
              </div>
            
          </div>
        </div>
      </section>
    )
  }

  export default Login
