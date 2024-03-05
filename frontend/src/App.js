import Login from "./componets/login.js";
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Register from "./componets/register.js";
import Dasboard from "./componets/dasboard.js";
import Navbar from "./componets/navbar.js";
import Addjob from "./componets/addjob.js";
import Edit from "./componets/edit.js";




function App() {
  return (
    <Router > 
      <Routes>
        <Route exact path="/login" element={<Login/>}/>
        <Route  path="/" element={<Register/>}/>
        <Route  path="/dasboard" element={
        <>
        <Navbar/>
        <Dasboard/>
        </>
        }/>
        <Route path = "/addjobs" element={
          <>
          <Navbar />
          <Addjob/>
          </>
        }/>
        <Route path = "/updated/:id" element={
          <>
          <Navbar />
          <Edit />
          </>
        }/>

    </Routes>
 
    </Router>
  );
}

export default App;
