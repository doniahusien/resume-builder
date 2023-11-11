import ResumeBuilder from './Home';
import Resume from './component/Resume';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
       <Router>
       <Routes>
        <Route path="/" element={<ResumeBuilder />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
