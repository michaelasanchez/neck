import * as React from 'react';
import { useState } from 'react';
import { defaultOptions, IOptions, Key, Mode, Tuning } from '../models';
import { Backdrop } from './Backdrop';
import { Neck } from './neck';
import { Ui } from './ui';

export interface HomeProps {
  defaultKey?: Key;
  defaultTuning?: Tuning;
  defaultMode?: Mode;
}

const defaultProps: HomeProps = {};

const Home: React.FunctionComponent<HomeProps> = ({}) => {
  const [options, setOptions] = useState<IOptions>(defaultOptions);

  const handleSetOptions = (updated: Partial<IOptions>) => {
    setOptions({
      ...options,
      ...updated,
    });
  };

  return (
    <>
      {/* <div className="layer outer"> */}
        <Backdrop options={options} />
      {/* </div>
      <div className="layer outer"> */}
        <div className="layer">
          <Neck options={options} />
        </div>
      {/* </div> */}
      <Ui options={options} setOptions={handleSetOptions} />
    </>
  );
};

Home.defaultProps = defaultProps;

export default Home;
