import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { TuningNote } from '../../models';

const MENU_MAX_HEIGHT = 200;
const NUM_MENU_ITEMS = 7;

export interface DropOverProps {
  id: string;
  currentIndex: number;
  options: Array<DropOverOption<any>>;
  disabled?: boolean;
  onChange?: (value: any) => void;
}

export interface DropOverOption<T> {
  label: React.ReactElement;
  value: T;
}

export const DropOver: React.FunctionComponent<DropOverProps> = (props) => {
  const { currentIndex, id, options, disabled = false, onChange } = props;

  const [menuItemHeight, setMenuItemHeight] = useState<number>();
  const [menuOffset, setMenuOffset] = useState<number>(0);

  const [toggle, setToggle] = useState<boolean>();

  // const menuRef = useRef();
  const scrollRef = useRef();
  const activeRef = useRef();

  useEffect(() => {
    setToggle(false);
  }, []);

  useEffect(() => {
    let active = null,
      scroll = null;
    if (
      !!activeRef?.current &&
      !!scrollRef?.current
    ) {
      active = activeRef.current as HTMLDivElement;
      scroll = scrollRef.current as HTMLDivElement;

      if (!!toggle) {
        if (!disabled) {
          scroll.scrollTop = active.offsetTop - 102;

          setMenuOffset(active.offsetTop);
          if (!menuItemHeight) setMenuItemHeight(active.offsetHeight);
        }
      } else {
        // scroll.scrollTop = active.offsetTop;
      }
    } else if (!menuItemHeight) {
      setMenuItemHeight(30);
    }
  }, [toggle]);

  useEffect(() => {
    if (!disabled && !!activeRef.current && !!scrollRef.current) {
      const active = activeRef.current as HTMLDivElement;
      const scroll = scrollRef.current as HTMLDivElement;

      scroll.scrollTop = active.offsetTop;
      setMenuOffset(active.offsetTop);
    }
  }, [disabled]);

  return (
    <>
      {/* .dropdown-menu */}
      <style>
        {`
          .menu-${id} {
          }
          .menu-${id}.show {
            max-height: calc(${NUM_MENU_ITEMS * menuItemHeight}px + 18px);
          }
          /*
          .menu-${id} .menu-container {
            transform: translateY(calc(-${menuOffset}px - 9px));
          }
          .menu-${id}.show .menu-container {
            
            transform: translateY(calc(-${menuOffset}px + 96px));
          }
          */
          .menu-${id} .scroll-container {
            transform: translateY(-111px);
            
          }
          .menu-${id}.show .scroll-container {
            transform: translateY(-6px);
          }
        `}
      </style>
      <Dropdown
        id={`${id}`}
        className={`${disabled ? 'disabled ' : ''}dropover`}
        // ref={menuRef}
        onToggle={(e) => setToggle(e)}
      >
        <Dropdown.Toggle
          disabled={disabled}
          variant={disabled ? 'light' : 'outline-secondary'}
        >
          {options[currentIndex]?.label || ' - '}
        </Dropdown.Toggle>
        <Dropdown.Menu renderOnMount={true} className={`menu-${id}`}>
          <div
            className="scroll-container"
            ref={scrollRef}
            style={{
              maxHeight: toggle
                ? `calc(${NUM_MENU_ITEMS * menuItemHeight}px + 18px)`
                : 224,
            }}
          >
            <div className="menu-container">
              {map(options, (o, i) => {
                let active = i === currentIndex;
                return (
                  <Dropdown.Item
                    eventKey={i.toString()}
                    key={i}
                    active={active}
                    ref={active ? activeRef : null}
                    onScroll={(e: any) => {
                      // console.log('scroll', e);
                      e.preventDefault();
                    }}
                    onClick={(e: any) => onChange && onChange(o.value)}
                  >
                    {o.label}
                  </Dropdown.Item>
                );
              })}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};
