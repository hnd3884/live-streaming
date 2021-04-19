import {
  BrowserRouter,
  Route,
} from "react-router-dom";
import Home from "./pages/home.page";
import Login from "./pages/login.page";
import Watch from "./pages/watch.page";
import BroadCaster from "./pages/broadcaster.page";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route exact path="/broadcaster" component={BroadCaster} />
      <Route exact path="/watch/:id" render={({ match }) => <Watch broadcasterId={match.params.id}/>} />
      <Route exact path="/login" component={Login} />
    </BrowserRouter>
  );
}

export default App;
