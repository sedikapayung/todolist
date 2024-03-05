import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const Addjob = () => {
  const [userId,setUserId] = useState('')
    const [job,setJob] = useState('');
    const [description,setDescription] = useState('');
    const [deadline,setDeadline] =useState('');
    const [expire,setExpire]=useState('');
    const [token,setToken]=useState('');
    const navigate =useNavigate()
    
    useEffect(()=>{
      refressToken();
    },[])
    
      const refressToken = async()=>{
        try {
          const response = await axios.get('http://localhost:3001/token');
          setToken(response.data.accesToken)
          const decoded = jwtDecode(response.data.accesToken);
          setUserId(decoded.userId)
          setExpire(decoded.exp)
        } catch (error) {
          if(error.response){
            navigate('/')
          }
        }
        
      } 
      const axiosJwt = axios.create()

      axiosJwt.interceptors.request.use(async(config)=>{
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()){
          try {
            const response = await axios.get('http://localhost:3001/token')
            config.headers.Authorization = `Bearer ${response.data.accesToken}`
            setToken(response.data.accesToken)
            const decoded = jwtDecode(response.data.accesToken);
            setUserId(decoded.userId)
            setExpire(decoded.exp)
          } catch (error) {
            console.log("error reffreshing token:",error)
            navigate('/')
            return Promise.reject(error)
          }
        }
        return config
      },(error)=>{
        console.log("interceptor error:",error)
        return Promise.reject(error)
      })

  const addJobs =async()=>{
    try {
      await axiosJwt.post('http://localhost:3001/api/new/jobs',{
        jobs:job,
        description:description,
        deadline:deadline,
        createdBy:userId
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      navigate('/dasboard')
    } catch (error) {
      console.log("there was an error when adding data:",error)
    }
  }

  return (
    <div>
      <div className="field">
        <label className="label">
      Jobs</label>
        <div className="control">
          <input className="input" type="text" placeholder="enter your job name here" value={job} onChange={(e)=>setJob(e.target.value)}/>
        </div>
      </div>
      
      <div className="field">
        <label className="label">Description</label>
        <div className="control has-icons-left has-icons-right">
          <input className="input is-success" type="text" placeholder="Enter your description here" value={description} onChange={(e)=>setDescription(e.target.value)} />
          <span className="icon is-small is-left">
            <i className="fas fa-user"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-check"></i>
          </span>
        </div>
      </div>
      <input className=" is-success" type="date" value={deadline} onChange={(e)=>setDeadline(e.target.value)} />
      <br/>
      <br/>
  
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" onClick={addJobs}>Submit</button>
        </div>
        <div className="control">
          <button className="button is-text">Cancel</button>
        </div>
      </div>
      
    </div>
  )
}

export default Addjob
