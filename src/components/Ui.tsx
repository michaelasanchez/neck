import * as React from "react"

import { Navbar } from "./ui/Navbar";
import { Options } from "./ui/Options";

export interface UiProps {
}

export interface UiState {
  showOptions: boolean,
}

export class Ui extends React.Component<UiProps, UiState> {
    public state: any;

    constructor(props: any) {
      super(props);

      this.state = {
        showOptions: false,
      }
    }

    showOptions() {
      this.setState({
        showOptions: true,
      })
    }

    hideOptions() {
      this.setState({
        showOptions: false,
      })
    }

    render() {
        return (
          <>
            <Navbar show={() => this.showOptions()} test={this.state.showOptions}/>
            <Options hide={() => this.hideOptions()} showing={this.state.showOptions} />
          </>
        )
    }
}