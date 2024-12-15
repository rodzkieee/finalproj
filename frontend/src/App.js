import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shoes from "./pages/Shoes";
import Add from "./pages/Add";
import Update from "./pages/Update";
import LandingPage from "./pages/LandingPage"; 
import LoginSignup from "./pages/LoginSignup";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path ="/" element= {<LandingPage/>}></Route>
        <Route path ="/LoginSignup" element= {<LoginSignup/>}></Route>
        <Route path ="/shoes" element= {<Shoes/>}></Route>
        <Route path ="/add" element= {<Add/>}></Route>
        <Route path ="/update/:id" element= {<Update/>}></Route>
        
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
