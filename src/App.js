import {Routes, Route, BrowserRouter} from "react-router-dom"
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Dashboard />}/>
      <Route path="/auth" element={<AuthPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
