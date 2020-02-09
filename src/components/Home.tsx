import * as React from "react"

import { Neck } from "./Neck";
import { Ui } from "./Ui";

export interface HomeProps {
}

export interface HomeState {
}

export class Home extends React.Component<HomeProps, HomeState> {
    public state: any;

    constructor(props: any) {
      super(props);

      console.log('Home', this);
    }

    render() {
        return (
          <>
            <Neck />
            <Ui />
          </>
        )
    }
}