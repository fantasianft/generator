import "./App.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownList from "./components/DropdownList";
import Canvas from "./components/Canvas";
import Store from "./Store";

function App() {
  return (
    <Store>
      <Button variant="primary">Generate</Button>
      <DropdownList />
      <Canvas />
    </Store>
  );
}

export default App;
