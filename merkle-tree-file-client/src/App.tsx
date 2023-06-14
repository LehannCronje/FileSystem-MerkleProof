import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import FilesUpload from "./components/FileUpload";

const App: React.FC = () => {
  return (
    <div className="container" style={{ width: "800px" }}>
      <figure className="text-center m-5">
        <blockquote className="blockquote">
          <h1>Merkle - the Miracle of validility proof.</h1>
        </blockquote>
        <figcaption className="blockquote-footer">
          Said someone with a lot of Wisdom.
        </figcaption>
      </figure>
      <FilesUpload />
    </div>
  );
}

export default App;
