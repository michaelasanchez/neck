import * as React from "react"
import { times } from 'lodash'

export interface FretNumbersProps {
  frets: number
}

export class FretNumbers extends React.Component<FretNumbersProps, {}> {

  render() {
    return (
      <div className="fret-number-group">
        {times(this.props.frets, (i) => <div className="label">{i + 1}</div>)}
      </div>
    );
  }

}