import { Routes, Route, BrowserRouter } from "react-router-dom";
import AuthPage from "./pages/AuthPage/AuthPage.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import TakeQuiz from "./components/TakeQuiz/TakeQuiz.jsx";
import ThankYouPage from "./components/Thankyou/ThankYouPage.jsx";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz/take/:uniqueLink" element={<TakeQuiz />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
