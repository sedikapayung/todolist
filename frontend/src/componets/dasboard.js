import React, { useState,useEffect } from 'react'
import {jwtDecode } from 'jwt-decode'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import '../style/app.css'
import { useParams } from 'react-router-dom'

const Dasboard = () => {
  
  const [name,setName]= useState('');
  const [token,setToken]=useState('');
  const [expire,setExpire]=useState('');
  const [job,setJob]=useState([]);
  const{id} = useParams();
  const navigate=useNavigate()

useEffect(()=>{
  refressToken();
},[])

useEffect(() => {
  // Panggil getJob setelah token diperbarui
  if (token !== '') {
    getJob();
  }
}, [token]);

  const refressToken = async()=>{
    try {
      const response = await axios.get('http://localhost:3001/token');
      setToken(response.data.accesToken)
      const decoded = jwtDecode(response.data.accesToken);
      setName(decoded.Name)
      setExpire(decoded.exp)
    } catch (error) {
      if(error.response){
        navigate('/')
      }
    }
    
  } 
const axiosJwt =axios.create()  

axiosJwt.interceptors.request.use(async(config)=>{
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()){
      try {
        const response = await axiosJwt.get('http://localhost:3001/token');
      config.headers.Authorization = `Bearer ${response.data.accesToken}`
      setToken(response.data.accesToken)
      const decoded = jwtDecode(response.data.accesToken);
    
      setName(decoded.Name)
      setExpire(decoded.exp)
      } catch (error) {
        console.error("Error refreshing token:", error);
      navigate('/');
      return Promise.reject(error);
      }
      
    }
    return config
  },(error)=>{
    console.error("Interceptor error:", error);
    return Promise.reject(error)
  }
  )
  const getJob = async()=>{
    try {
      const response = await axiosJwt.get('http://localhost:3001/api/jobs',{
        headers :{
          Authorization: `Bearer ${token}`
        }
      });
      if (Array.isArray(response.data.data)) {
        setJob(response.data.data);
      } else {
        console.error("Response data is not an array:", response.data);
      }

    } catch (error) {
      if(error.response){
        navigate('/dasboard')
      }
    } 
   
  }
 
  const deleted =async(id)=>{
    try {
      await axiosJwt.delete(`http://localhost:3001/api/deleted/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setJob(job.filter((item) => item.id !== id));
navigate('/dasboard')
    } catch (error) {
     if(error){
      console.log(error)
     } 
    }
  }
  
  return (

      <div className='container mt-5'>
      <h1 >welcome back:{name}</h1>
    
      {job.map((result,index)=>(
      <div className="card" key={index}>
      <div className="card-content" >
      <div className="content"> 
        <p>{result.jobs}</p>
        <br />
        <p>{result.description}</p>
        <br />
        <p>{result.deadline}</p>
      </div>
    </div>
    <footer className="card-footer"  >
     
      <a href={`/updated/${result.id}`} className="card-footer-item">Edit</a>
      <a  onClick={() => deleted(result.id)} className="card-footer-item">Delete</a>
    </footer>
    </div>


    ))}
      </div>
  )
}

export default Dasboard
