import "./App.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { LayerDropdownsComponent } from "./components/DropdownList";
import { Canvas } from "./components/Canvas";
import Store from "./Store";

function App() {
  return (
    <Store>
      <Button variant="primary">Generate</Button>
      <LayerDropdownsComponent />
      <Canvas />
    </Store>
  );
}

export default App;
