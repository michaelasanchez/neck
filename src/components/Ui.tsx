import * as React from "react"

import { Navbar } from "./ui/Navbar";
import { Options } from "./ui/Options";
import { OptionsModel } from "../models/options.model";

export interface UiProps {
}

export interface UiState {
  options: OptionsModel
}

export class Ui extends React.Component<UiProps, UiState> {
    public state: any;

    constructor(props: any) {
      super(props);

      this.state = {
        options: new OptionsModel(),
      }

      console.log('Ui', this);
    }

    showOptions() {
      this.setState({
        options: {
          show: true
        }
      })
    }

    hideOptions() {
      this.setState({
        options: {
          show: false
        }
      })
    }

    render() {
        return (
          <>
            <Navbar show={() => this.showOptions()} test={this.state.options.show}/>
            <Options hide={() => this.hideOptions()} options={this.state.options} />
          </>
        )
    }
}