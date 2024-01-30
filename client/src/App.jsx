import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import QWAnalytics from "./pages/QWAnalytics";
import Quiz from "./pages/Quiz";

import {GlobalState} from "./context/GlobalContext";
import {AnalyticsState} from "./context/AnalyticsContext";
import { QuizState } from "./context/QuizContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopLoadingBar from "./components/TopLoadingBar";


function App() {
  return (
    <>
    <GlobalState>
    <AnalyticsState>
    <QuizState>
    <ToastContainer autoClose={1000} />
    <TopLoadingBar />
      <Router>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/quiz/:id" element={<Quiz />} />
          </Routes>
        </div>
      </Router>
      </QuizState>
      </AnalyticsState>
      </GlobalState>
    </>
  );
}

export default App;
