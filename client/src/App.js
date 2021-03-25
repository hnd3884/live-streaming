import {
  BrowserRouter ,
  Route,
} from "react-router-dom";
import Home from "./pages/home.page";
import Login from "./pages/login.page";
import Watch from "./pages/watch.page";

function App() {
  return (
      <BrowserRouter>
        <Route exact path="/" component={Home} />
        <Route exact path="/watch" component={Watch} />
        <Route exact path="/login" component={Login} />
      </BrowserRouter>
  );
}

export default App;
