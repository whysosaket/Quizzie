import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            {/* <Route path="/checkout">
                    <Route path="" element={<Checkout />} />
                    <Route path=":id" element={<Checkout buyNow={true} />} />
                  </Route> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
