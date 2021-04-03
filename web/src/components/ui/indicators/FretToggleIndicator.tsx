import * as React from 'react';

interface IndicatorProps {
  show: boolean;
  barreClass?: string;
  fretClass?: string;
  indicatorClass?: string;
  degree?: number;
  label?: string;
  open?: boolean;
  muted?: boolean;
  root?: boolean;
  barre?: boolean;
  fretRef?: React.MutableRefObject<HTMLDivElement>;
}

export const FretToggleIndicator: React.FC<IndicatorProps> = (props) => {
  const {
    open,
    show,
    barreClass,
    fretClass,
    indicatorClass,
    degree,
    label,
    muted = false,
    root = false,
    barre = false,
    fretRef: ref,
  } = props;
  let fretProps = ref ? { ref } : {};
  return (
    <div
      className={`fret${open ? ' open' : ''}${
        fretClass ? ` ${fretClass}` : ''
      }`}
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
            }${
              degree ? ` degree degree-${degree}` : ''
              //   ${barre ? (barreStart ? ' barre start' : ' barre') : ''}
            }${root ? ' root' : ''}`}
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
