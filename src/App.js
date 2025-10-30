import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskDetail from "./components/TaskDetail/TaskDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
