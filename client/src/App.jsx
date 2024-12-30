import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import QWAnalytics from "./pages/QWAnalytics";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound"; // Import the 404 page

import { GlobalState } from "./context/GlobalContext";
import { AnalyticsState } from "./context/AnalyticsContext";
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
            <ToastContainer autoClose={3000} />
            <TopLoadingBar />
            <Router>
              <div className="">
                <Routes>
                  {/* <Route exact path="/" element={<Home />} /> */}
                  {/* <Route path="/auth" element={<Auth />} /> */}
                  <Route path="/quiz/:id" element={<Quiz />} />
                  <Route path="*" element={<NotFound />} />
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
