import * as React from "react"

import { Neck } from "./neck/Neck";
import { Ui } from "./ui/Ui";

import { Key } from "../models/Key";
import { Mode } from "../models/Mode";
import { Tuning } from "../models/Tuning";

export interface HomeProps {
  defaultKey?: Key,
  defaultTuning?: Tuning,
  defaultMode?: Mode,
}

const defaultProps: HomeProps = {
  defaultKey: Key.D(),
  defaultTuning: Tuning.Standard(),
  defaultMode: Mode.Ionian(),
}

const Home: React.FunctionComponent<HomeProps> = ({ }) => {
  const [key, setKey] = React.useState<Key>(Key.C().Sharp());
  const [tuning, setTuning] = React.useState<Tuning>(Tuning.Standard());
  const [mode, setMode] = React.useState<Mode>(Mode.Ionian());

  return (
    <>
      <Neck musicKey={key} tuning={tuning} mode={mode} />
      <Ui
        defKey={key}
        setKey={(k: Key) => setKey(k)}
        setTuning={(t: Tuning) => setTuning(t)}
        setMode={(m: Mode) => setMode(m)} />
    </>
  );
}

Home.defaultProps = defaultProps;

export default Home;