import * as React from 'react';

interface IndicatorProps {
  show: boolean;
  fretClassName?: string;
  degree?: number;
  label?: string;
  open?: boolean;
  muted?: boolean;
  root?: boolean;
  firstRef?: React.MutableRefObject<HTMLDivElement>;
}

export const Indicator: React.FC<IndicatorProps> = (props) => {
  const {
    open,
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
      className={`fret${open ? ' open' : ''}${
        fretClassName ? ` ${fretClassName}` : ''
      }`}
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
