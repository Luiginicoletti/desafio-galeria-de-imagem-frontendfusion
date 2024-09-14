import "./App.css";
import Gallery from "./components/Gallery";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-teal-300/30 via-orange-500/20 to-violet-500/40 ">
      <div className="">
        <Gallery />
      </div>
    </div>
  );
}

export default App;
