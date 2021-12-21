import "./App.css";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DropdownList from "./components/DropdownList";

function App() {
  return (
    <div className="App">
      <Button variant="primary">Generate</Button>
      <DropdownList />
    </div>
  );
}

export default App;
