'use strict';

import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

// SVG source:
// https://github.com/lipis/flag-icon-css/tree/master/flags/4x3

export default function( props )
{
  return(
    <SvgIcon viewBox="0 0 640 480" {...props}>
      <g strokeWidth="1pt">
        <path fill="#229e45" d="M0 0h640v480H0z"/>
        <path d="M321.4 435.9l301.5-195.7-303.3-196.2L17.1 240.7l304.3 195.2z" fill="#f8e509"/>
        <path d="M452.8 240c0 70.3-57.1 127.3-127.5 127.3-70.4 0-127.5-57-127.5-127.3s57.1-127.3 127.5-127.3c70.4 0 127.5 57 127.5 127.3z" fill="#2b49a3"/>
        <path d="M219.3 287.6l-2.6-1.5-2.7 1.4-3-2.1-2.2 3-0.4 1.4-2.7 1.3 2.8 3-2.2 2.1" fill="#ffffef"/>
        <path d="M444.4 285.8c1.9-5.1 4.5-12.7 5.8-19.8-67.7-59.5-143.3-90-238.7-83.7-3.4 6.6-6.2 13.4-8.5 20.9 113.1-10.8 195.9 39.3 241.4 82.7z" fill="#ffffff"/>
      </g>
    </SvgIcon>
  )
}