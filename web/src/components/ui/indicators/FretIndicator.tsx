import * as React from 'react';
import { FretDisplayMode } from '../../neck';

interface IndicatorProps {
  show: boolean;
  barreClass?: string;
  fretClass?: string;
  indicatorClass?: string;
  pitch?: number;
  label?: React.ReactElement;
  open?: boolean;
  muted?: boolean;
  root?: boolean;
  barre?: boolean;
  toggle?: boolean;
  fretRef?: React.MutableRefObject<HTMLDivElement>;
  onClick?: (...e: any[]) => void;
}

export const FretIndicator: React.FC<IndicatorProps> = (props) => {
  const {
    open,
    show,
    barreClass,
    fretClass,
    indicatorClass,
    pitch,
    label,
    muted = false,
    root = false,
    barre = false,
    fretRef,
    onClick,
  } = props;

  let fretProps = fretRef ? { ref: fretRef } : {};

  return (
    <div
      className={`fret${open ? ' open' : ''}${
        fretClass ? ` ${fretClass}` : ''
      }`}
      onClick={onClick}
      {...fretProps}
    >
      {barre && (
        <div className={`barre${barreClass ? ` ${barreClass}` : ''}`}></div>
      )}
      {show && (
        <>
          <div
            className={`indicator${indicatorClass ? ` ${indicatorClass}` : ''}${
              muted ? ' muted' : ''
            }${pitch != null && pitch != undefined ? ` pitch-${pitch}` : ''}${root ? ' root' : ''}`}
          >
            {muted && (
              <>
                <div></div>
                <div></div>
                <div></div>
              </>
            )}
          </div>
          {label && <label>{label}</label>}
        </>
      )}
    </div>
  );
};
