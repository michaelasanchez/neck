import * as React from "react"

export interface FretProps {
  open?: boolean;
  fret: number;
}

export class Fret extends React.Component<FretProps, {}> {
  public static defaultProps = {
    open: false,
  };

  render() {
    let fretClass = 'fret' + (this.props.open === true ? ' open' : '');
    return (
        <div className={fretClass}>
          <div className="label prev">
            <label></label>
            <label></label>
            <div className="fret-symbol"></div>
          </div>
          <div className="label next">
            <label></label>
            <label></label>
            <div className="fret-symbol"></div>
          </div>
        </div>
    );
  }
}