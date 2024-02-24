import Svg, { Path } from 'react-native-svg';

export const HomeIcon = ({width = 19, isActive}) => {
  const aspectRatio = 19 / 21; // Derived from the viewBox values "0 0 19 21"
  const calculatedHeight = width / aspectRatio;

  return (
    <>
    {
      isActive
      ?
      <Svg width={width} height={calculatedHeight} viewBox="0 0 19 21" fill="none" >
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.84337V17.9639C0 19.988 1 21 3 21H16C18 21 19 19.988 19 17.9639V7.84337C19 6.83132 18.5 5.81927 17 4.80723L11.5 0.759038C10 -0.253016 9 -0.253009 7.5 0.759038L2 4.80723C0.5 5.81927 0 6.83132 0 7.84337ZM15.5 18.9759C16.5 18.9759 17 18.4699 17 17.4578V7.84337C17 7.33734 16.5 6.83132 16 6.3253L10.5 2.27711C10 2.02409 9.75 1.89759 9.5 1.89759C9.25 1.89759 9 2.02409 8.5 2.27711L3 6.3253C2.5 6.83132 2 7.33734 2 7.84337V17.4578C2 18.4699 2.5 18.9759 3.5 18.9759H15.5Z" fill="#D9D9D9"/>
        <Path d="M12 12.3971H7C6 12.3971 5.5 13.4091 5.5 14.4212C5.5 15.4332 6 15.9393 7 15.9393H12C13 15.9393 13.5 15.4332 13.5 14.4212C13.5 13.4091 13 12.3971 12 12.3971Z" fill="#D9D9D9"/>
      </Svg>
      :
      <Svg width={width} height={calculatedHeight} viewBox="0 0 19 21" fill="none" >
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.84337V17.9639C0 19.988 1 21 3 21H16C18 21 19 19.988 19 17.9639V7.84337C19 6.83132 18.5 5.81927 17 4.80723L11.5 0.759038C10 -0.253016 9 -0.253009 7.5 0.759038L2 4.80723C0.5 5.81927 0 6.83132 0 7.84337ZM15.5 18.9759C16.5 18.9759 17 18.4699 17 17.4578V7.84337C17 7.33734 16.5 6.83132 16 6.3253L10.5 2.27711C10 2.02409 9.75 1.89759 9.5 1.89759C9.25 1.89759 9 2.02409 8.5 2.27711L3 6.3253C2.5 6.83132 2 7.33734 2 7.84337V17.4578C2 18.4699 2.5 18.9759 3.5 18.9759H15.5Z" fill="#D9D9D9"/>
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M17 17.4578C17 18.4699 16.5 18.9759 15.5 18.9759H3.5C2.5 18.9759 2 18.4699 2 17.4578V7.84337C2 7.33734 2.5 6.83132 3 6.3253L8.5 2.27711C9 2.02409 9.25 1.89759 9.5 1.89759C9.75 1.89759 10 2.02409 10.5 2.27711L16 6.3253C16.5 6.83132 17 7.33734 17 7.84337V17.4578ZM12 12.3971H7C6 12.3971 5.5 13.4091 5.5 14.4212C5.5 15.4332 6 15.9393 7 15.9393H12C13 15.9393 13.5 15.4332 13.5 14.4212C13.5 13.4091 13 12.3971 12 12.3971Z" fill="#D9D9D9"/>
      </Svg>
    }
    </>
  )
}