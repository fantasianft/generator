import "./App.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownList from "./components/DropdownList";
import Canvas from "./components/Canvas";

function App() {
  return (
    <div className="App">
      <Button variant="primary">Generate</Button>
      <DropdownList />
      <Canvas />
    </div>
  );
}

export default App;
