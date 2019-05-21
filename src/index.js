import React from "react";
import ReactDOM from "react-dom";
import { saveAs } from "file-saver";

import { createBlob } from "./blob";

class App extends React.Component {
  state = {
    points: 4
  };

  handlePoints = e => {
    this.setState({ points: e.target.value });
  };

  refresh = () => {
    this.setState({ points: this.state.points });
  };

  download = blobSVG => {
    var content = blobSVG;
    var filename = "blob.svg";
    var blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);
  };

  render() {
    const { points } = this.state;

    const blobSVG = createBlob(points);

    return (
      <div>
        <div>
          <label htmlFor="points">Complexity: </label>
          <input
            onChange={this.handlePoints}
            type="range"
            value={points}
            id="points"
            name="points"
            min="4"
            step="2"
            max="14"
          />
        </div>
        <div dangerouslySetInnerHTML={{ __html: blobSVG }} />
        <div>
          <button onClick={this.refresh}>Refresh</button>
          <button onClick={() => this.download(blobSVG)}>Download</button>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
