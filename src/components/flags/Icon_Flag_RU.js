'use strict';

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

// SVG source:
// https://github.com/lipis/flag-icon-css/tree/master/flags/4x3
const Icon_Flag_RU = (props) => {
  return (
    <SvgIcon viewBox="0 0 640 480" {...props}>
      <g id="flag" fillRule="evenodd" strokeWidth="1pt" transform="matrix(1.25 0 0 .93750 0 -.0000020021)">
        <rect id="rect171" height="512" width="512" y=".0000024116" x="0" fill="#fff"/>
        <rect id="rect403" height="341.33" width="512" y="170.67" x="0" fill="#01017e"/>
        <rect id="rect135" height="170.67" width="512" y="341.33" x="0" fill="#fe0101"/>
      </g>
    </SvgIcon>
  )
}
export default Icon_Flag_RU;