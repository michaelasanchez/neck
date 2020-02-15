import * as React from "react"

import { Neck } from "./Neck";
import { Ui } from "./Ui";
import { Key } from "../models/Key";

export interface HomeProps {
}

export interface HomeState {
  key: Key,
}

export class Home extends React.Component<HomeProps, HomeState> {
    public state: any;

    constructor(props: any) {
      super(props);

      this.state = {
        key: Key.F().Sharp(),
      }
      console.log('home', this.state.key);
    }

    setKey(newKey: Key) {
      console.log('newKey', newKey.Root.toString());
      
      let newState = {
        key: newKey,
      } as HomeState;

      console.log('newState', newState);

      this.setState({
        key: newKey,
      }, () => {
        console.log(this.state, 'dealersOverallTotal1');
      }); 
      
      console.log('after', this.state.key.Root.Label);
    }

    render() {
      console.log('home render', this.state.key);
        return (
          <>
            <Neck test={this.state.key} />
            <Ui setKey={(k: Key) => this.setKey(k)} />
          </>
        )
    }
}