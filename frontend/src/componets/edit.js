import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useParams } from 'react-router-dom'


const Edit = () => {
  const [token, setToken]=useState('');
  const [job,setJob]=useState('');
  const [description,setDescription]=useState('');
  const [deadline,setDeadline]=useState('');
  const [fetchData,setFetchData] = useState('');
  const [expire,setExpire]=useState('');
  const {id} = useParams();
  const navigate = useNavigate();
  


  useEffect(()=>{
    refressToken();
  },[])
  useEffect(()=>{
    if (token !==''){getByid()}
  },[token])

  const refressToken =async()=>{
    try {
      const response = await axios.get('http://localhost:3001/token',{
        headers:{
          Authorization: `Bearer, ${token}`
        }
      });
      setToken(response.data.accesToken);
      const decoded = jwtDecode(response.data.accesToken);
      setExpire(decoded.exp)
      
    } catch (error) {
      if(error.response){
        console.log("there error when refreshing :",error)
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

  const getByid = async()=>{
    try {

      const response = await axiosJwt.get(`http://localhost:3001/api/getJobs/${id}`,{
        headers:{Authorization: `Bearer ${token}`}
      })
      setJob(response.data.data.jobs);
      setDescription(response.data.data.description);
      setDeadline(response.data.data.deadline)
      console.log(response.data)
    } catch (error) {
      console.log('there error when geting data 1:', error)
    }
  }


const handleCancel = ()=>{
  navigate('/dasboard')
}


const updatedData = async()=>{
  try {
    console.log('Updating data...');
     await axiosJwt.put(`http://localhost:3001/api/getJobs/${id}`,{
      description:description,
      jobs:job,
      deadline:deadline
    },{headers:{
      Authorization:`Bearer ${token}`
    }})
    navigate ('/dasboard')
  } catch (error) {
    if (error.response){
      console.log('Error when updating data:', error.response.data);
    }
  }
}
  return (
    <div>
      <div class="field">
        <label class="label">
      jobs</label>
        <div class="control">
          <input class="input" type="text" placeholder="" value={job} onChange={(e) => setJob(e.target.value)}/>
        </div>
      </div>
      
      <div class="field">
        <label class="label">description</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input is-success" type="text" placeholder="" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
      </div>

      <div class="field">
        <label class="label">deadline</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input is-success" type="date" placeholder=''value={deadline} onChange={(e) => setDeadline(e.target.value)}/>
        </div>
      </div>
      <div class="field">
        <button onClick={updatedData}>updated</button>
        <button onClick={handleCancel}>cancel</button>
      </div>
      
      
    </div>
  )
}

export default Edit
