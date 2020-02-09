import * as React from "react"

export interface FretMarkersProps {
  options: string
}

// export const Dang = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class FretMarkers extends React.Component<FretMarkersProps, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="fret-marker-group">
        <div className="fret-marker">
          <div className="marker"></div>
          <div className="marker"></div>
        </div>
      </div>
    );
  }
}