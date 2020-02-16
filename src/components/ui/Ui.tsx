import * as React from "react"

import { Navbar } from "./Navbar";
import { Options } from "./Options";

import { Key } from "../../models/Key";

export interface UiProps {
  defKey: Key;
  setKey: Function;
  setTuning: Function;
  setMode: Function;
}

export interface UiState {
  showOptions: boolean,
}

export const Ui: React.FunctionComponent<UiProps> = ({ defKey, setKey }) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  return (
    <>
      <Navbar show={() => setShowOptions(true)} setKey={(k: Key) => setKey(k)} defKey={defKey}/>
      <Options hide={() => setShowOptions(false)} showing={showOptions} />
    </>
  );
}