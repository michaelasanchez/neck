import * as React from 'react';

interface IndicatorProps {
  fretNum: number;
  show: boolean;
  fretClassName?: string;
  degree?: number;
  label?: string;
  muted?: boolean;
  root?: boolean;
  firstRef?: React.MutableRefObject<HTMLDivElement>;
}

export const Indicator: React.FC<IndicatorProps> = (props) => {
  const {
    fretNum,
    show,
    fretClassName,
    degree,
    label,
    muted = false,
    root = false,
    firstRef,
  } = props;
  let divProps: any = firstRef ? { ref: firstRef } : {};
  return (
    <div
      className={`fret${fretNum === 0 ? ' open' : ''}${
        fretClassName ? ` ${fretClassName}` : ''
      }`}
      key={fretNum}
      {...divProps}
    >
      {show && (
        <>
          <div
            className={`indicator${muted ? ' muted' : ''}${
              degree ? ` degree degree-${degree}` : ''
              //   ${barre ? (barreStart ? ' barre start' : ' barre') : ''}
            }${root ? ' root' : ''}`}
          ></div>
          {label && <label>{label}</label>}
        </>
      )}
    </div>
  );
};
