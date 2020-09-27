import * as React from 'react';
import { useState } from 'react';

import { defaultOptions, IOptions, Key, Mode, Note, Tuning } from '../models';
import { Backdrop } from './Backdrop';
import Indicators from './Indicators';
import { Neck } from './neck';
import { Ui } from './ui';

const USE_COOKIE = true;

export interface HomeProps {
  defaultKey?: Key;
  defaultTuning?: Tuning;
  defaultMode?: Mode;
}

const getCookie = (cname: string): string => {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

const setCookie = (cname: string, cvalue: string, exdays?: number) => {
  if (exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
  }
  document.cookie =
    cname + '=' + cvalue + ';' + (expires ? expires + ';' : '') + 'path=/';
};

const getDefaultOptions = (useCookie: boolean = USE_COOKIE): IOptions => {
  const saved = getCookie('options');

  let parsed;
  if (saved && useCookie) {
    parsed = JSON.parse(saved);
    const rootNote = new Note(parsed.key._tonic.base, parsed.key._tonic.suffix);

    parsed.key = new Key(rootNote);
    parsed.mode = new Mode(parsed.mode.name, parsed.mode.pattern);

    return parsed;
  }

  return defaultOptions;
};

const Home: React.FunctionComponent<HomeProps> = ({}) => {
  const [options, setOptions] = useState<IOptions>(getDefaultOptions());

  const handleSetOptions = (updated: Partial<IOptions>) => {
    const newOptions = {
      ...options,
      ...updated,
    };

    setCookie('options', JSON.stringify(newOptions));
    setOptions(newOptions);
  };

  return (
    <>
      <main>
        <Backdrop options={options} />
        <div className="neck-container">
          <Neck options={options} />
        </div>
        <div className="indicators-container">
          <Indicators options={options} />
        </div>
      </main>
      <Ui options={options} setOptions={handleSetOptions} />
    </>
  );
};

export default Home;
