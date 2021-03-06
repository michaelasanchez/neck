import { useEffect, useState } from 'react';
import { useCookie } from '.';
import { Cookie, Key, Mode, Note } from '../models';
import { AppOptions } from '../shared';

// Encode
const cookieStringFromAppOptions = (appOptions: AppOptions): string => {
  const cookie = new Cookie();
  cookie.instrumentId = appOptions.instrument.Id;
  cookie.tuningId =
    appOptions.tuning?.Id === appOptions.instrument.DefaultTuningId
      ? null
      : appOptions.tuning.Id;

  cookie.key = appOptions.key;
  cookie.mode = appOptions.mode;

  cookie.chordId = appOptions.chord.Id;
  cookie.scaleId = appOptions.scale.Id;

  cookie.indicatorsMode = appOptions.indicatorsMode;

  cookie.leftHandMode = appOptions.leftHandMode;
  cookie.leftHandUi = appOptions.leftHandUi;
  cookie.autoScroll = appOptions.autoScroll;

  cookie.neck = {
    numFrets: appOptions.instrument.NumFrets.toString(),
  };

  return JSON.stringify(cookie);
};

// Decode
const cookieFromCookieString = (cookieString: string): Cookie => {
  if (!cookieString) return null;

  const cookie: Cookie = JSON.parse(cookieString);

  const tonic = new Note(cookie.key.Tonic.Base, cookie.key.Tonic.Suffix);
  cookie.key = new Key(tonic, cookie.key.Type);
  cookie.mode = new Mode(cookie.mode.Label, cookie.mode.pattern);

  return cookie;
};

export const useNeckCookie = () => {
  const { getCookie: getBaseCookie, setCookie: setBaseCookie } = useCookie();

  const [cookie, setCookie] = useState<Cookie>();
  const [loading, setLoading] = useState<boolean>(true);

  // Init
  useEffect(() => {
    const saved = getBaseCookie('options');

    let cookie = cookieFromCookieString(saved);
    if (!saved) {
      cookie = Cookie.Default();
    }

    setCookie(cookie);
    setLoading(false);
  }, []);

  //
  const handleSetCookie = (options: AppOptions) => {
    const cookieString = cookieStringFromAppOptions(options);
    const cookie = cookieFromCookieString(cookieString);
    setCookie(cookie);
    setBaseCookie('options', cookieString);
  };

  return { loading, cookie, setCookie: handleSetCookie };
};
