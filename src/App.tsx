import "./App.css";
import { Terminal } from "./Terminal/Terminal";

const App = () => {
  return (
    <div className="content">
      <Terminal onClose={() => {}} onMinimize={() => {}} onExpand={() => {}} />
    </div>
  );
};

export default App;
