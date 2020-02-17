import * as React from "react"

import { Navbar } from "./Navbar";
import { OptionsModal } from "./OptionsModal";

import { Key } from "../../models/Key";
import { Mode } from "../../models/Mode";
import { Tuning } from "../../models/Tuning";

export interface UiProps {
  musicKey: Key;
  tuning: Tuning;
  mode: Mode;
  setKey: Function;
  setTuning: Function;
  setMode: Function;
}

export interface UiState {
  showOptions: boolean,
}

export const Ui: React.FunctionComponent<UiProps> = ({ musicKey, tuning, mode, setKey , setTuning, setMode }) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  return (
    <>
      <Navbar
        musicKey={musicKey}
        showing={showOptions}
        show={() => setShowOptions(true)}
        setKey={(k: Key) => setKey(k)}
      />
      <OptionsModal
        showing={showOptions}
        tuning={tuning}
        mode={mode}
        hide={() => setShowOptions(false)}
        setTuning={(t: Tuning) => setTuning(t)}
        setMode={(m: Mode) => setMode(m)}
      />
    </>
  );
}