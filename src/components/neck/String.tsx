import * as React from "react"

import { Fret } from "./Fret";

export interface StringProps {
  frets: number;
}

export class String extends React.Component<StringProps, {}> {

  render() {
    let frets = [];
    
    for (var i = 1; i < this.props.frets; i++) {
      frets.push(<Fret fret={this.props.frets} />);
    }

    return (
      <div className="string">
        <Fret open={true} fret={0} />
        {frets}
      </div>
    );
  }

}