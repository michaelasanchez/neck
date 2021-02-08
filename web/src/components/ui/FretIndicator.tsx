import * as React from 'react';

interface IndicatorProps {
  show: boolean;
  fretClassName?: string;
  degree?: number;
  label?: string;
  open?: boolean;
  muted?: boolean;
  root?: boolean;
  fretRef?: React.MutableRefObject<HTMLDivElement>;
}

export const FretIndicator: React.FC<IndicatorProps> = (props) => {
  const {
    open,
    show,
    fretClassName,
    degree,
    label,
    muted = false,
    root = false,
    fretRef: ref,
  } = props;
  let fretProps = ref ? { ref } : {};
  return (
    <div
      className={`fret${open ? ' open' : ''}${
        fretClassName ? ` ${fretClassName}` : ''
      }`}
      {...fretProps}
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
