import * as React from "react"

export interface FretLabelsProps {
  options: string
}

// export const Dang = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class FretLabels extends React.Component<FretLabelsProps, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="fret-label-group">
        {/* <div class="fret-label{{label && $index > 0 ? '' : ' open'}}" ng-repeat="label in options track by $index">{{label && $index > 0 ? $index : null}}</div> */}
      </div>
    );
  }
}