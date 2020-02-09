import * as React from "react"

export interface FretLabelsProps {
  frets: number
}

export class FretLabels extends React.Component<FretLabelsProps, {}> {

  render() {
    const labels: JSX.Element[] = [];
    for (var i = 1; i <= this.props.frets; i++) {
      labels.push(<div className="fret-label">{i}</div>)
    }

    return (
      <div className="fret-label-group">
        {labels}
      </div>
    );
  }

}