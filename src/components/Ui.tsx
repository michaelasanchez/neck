import * as React from "react"

import { Navbar } from "./ui/Navbar";
import { Options } from "./ui/Options";

import { Key } from "../models/Key";

export interface UiProps {
  test: Key;
  setKey: Function;
}

export interface UiState {
  showOptions: boolean,
}

export const Ui: React.FunctionComponent<UiProps> = ({ test, setKey }) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  return (
    <>
      <Navbar show={() => setShowOptions(true)} setKey={(k: Key) => setKey(k)} test={showOptions} testKey={test}/>
      <Options hide={() => setShowOptions(false)} showing={showOptions} />
    </>
  );
}