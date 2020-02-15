import * as React from "react"

import Neck from "./Neck";
import { Ui } from "./Ui";

import { Key } from "../models/Key";

export interface HomeProps {
}

export interface HomeState {
  key: Key,
}

export const Home: React.SFC<HomeProps> = ({}) => {
  const [key, setKey] = React.useState(Key.C());

  return (
    <>
    <Neck test={key} />
    <Ui setKey={(k: Key) => setKey(k)} test={key}/>
    </>
  );
}