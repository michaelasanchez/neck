import * as React from "react"

export interface StringProps {
  model: string;
  scale: string;
}

// export const Dang = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class String extends React.Component<StringProps, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="string"></div>
    );
  }
}