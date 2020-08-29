import * as React from "react";
import { Navbar, OptionsModal } from ".";
import { Key, Mode, Tuning, IOptions } from "../../models";

export interface UiProps {
  options: IOptions;
  setOptions: (options: Partial<IOptions>) => void;
}

export interface UiState {
  showOptions: boolean;
}

export const Ui: React.FunctionComponent<UiProps> = ({
  options,
  setOptions,
}) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);

  return (
    <>
      <Navbar
        musicKey={options.key}
        showing={showOptions}
        show={() => setShowOptions(true)}
        setKey={(k: Key) => setOptions({ key: k })}
      />
      <OptionsModal
        showing={showOptions}
        onHide={() => setShowOptions(false)}
        tuning={options.tuning}
        mode={options.mode}
        setTuning={(t: Tuning) => setOptions({ tuning: t })}
        setMode={(m: Mode) => setOptions({ mode: m })}
      />
    </>
  );
};
