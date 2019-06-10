import React from "react";
import ReactDOM from "react-dom";
import anime from "animejs";
import { saveAs } from "file-saver";
import createBlobString from "./blob";

import "./styles.css";

class App extends React.Component {
  state = {
    points: 4
  };

  componentDidMount() {
    this.setupAnimeJS();
  }

  handlePoints = e => {
    this.setState({ points: e.target.value });
  };

  refresh = () => {
    const { points } = this.state;
    this.setState({ points: points });
  };

  download = blobSVG => {
    var content = blobSVG;
    var filename = "blob.svg";
    var blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

    saveAs(blob, filename);
  };

  setupAnimeJS = () => {
    const el = document.getElementById("blob-svg");

    anime({
      targets: el,
      points: [
        {
          value: [
            "70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369",
            "70 41 118.574 59.369 111.145 132.631 60.855 84.631 20.426 60.369"
          ]
        },
        {
          value:
            "70 6 119.574 60.369 100.145 117.631 39.855 117.631 55.426 68.369"
        },
        {
          value:
            "70 57 136.574 54.369 89.145 100.631 28.855 132.631 38.426 64.369"
        },
        {
          value:
            "70 24 119.574 60.369 100.145 117.631 50.855 101.631 3.426 54.369"
        }
      ],
      easing: "easeOutQuad",
      duration: 2000,
      loop: true
    });
  };

  render() {
    const { points } = this.state;

    const blobString = createBlobString(points);

    return (
      <div className="App">
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
            max="20"
          />
        </div>
        <div
          ref={ref => (this.blob = ref)}
          dangerouslySetInnerHTML={{ __html: blobString }}
        />
        <div>
          <button onClick={this.refresh}>Refresh</button>
          <button onClick={() => this.download(blobString)}>Download</button>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
