import * as React from "react"

import { Navbar } from "./Navbar";
import { OptionsModal } from "./OptionsModal";

import { Key } from "../../models/Key";

export interface UiProps {
  musicKey: Key;
  setKey: Function;
  setTuning: Function;
  setMode: Function;
}

export interface UiState {
  showOptions: boolean,
}

export const Ui: React.FunctionComponent<UiProps> = ({ musicKey, setKey }) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  return (
    <>
      <Navbar
        show={() => setShowOptions(true)}
        musicKey={musicKey}
        setKey={(k: Key) => setKey(k)} />
      <OptionsModal hide={() => setShowOptions(false)} showing={showOptions} />
    </>
  );
}