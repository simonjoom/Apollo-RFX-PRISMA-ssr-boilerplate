'use strict';
import newId from '../../utils';
import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

// SVG source:
// https://github.com/lipis/flag-icon-css/tree/master/flags/4x3

export default function(props) {
  var mid = newId("a");
  var ri = "#" + mid;
  return (
    <SvgIcon viewBox="0 0 640 480" {...props}>
      <defs id="defs155">
        <path id={mid} fill='#ffde00' d="M-.588.81L0-1 .588.81-.952-.31H.952z"/>
      </defs>
      
      <g id="flag">
        <path fill='#de2910' d="M0 0h640v480H0z"/>
        <use xlinkHref={ri} transform="matrix(71.9991 0 0 72 119.999 120)" height="20" width="30"/>
        <use xlinkHref={ri} transform="matrix(-12.33562 -20.5871 20.58684 -12.33577 240.291 47.996)" height="20"
             width="30"/>
        <use xlinkHref={ri} transform="matrix(-3.38573 -23.75998 23.75968 -3.38578 287.95 95.796)" height="20" width="30"/>
        <use xlinkHref={ri} transform="matrix(6.5991 -23.0749 23.0746 6.59919 287.959 168.012)" height="20" width="30"/>
        <use xlinkHref={ri} transform="matrix(14.9991 -18.73557 18.73533 14.99929 239.933 216.054)" height="20"
             width="30"/>
      </g>
    
    </SvgIcon>
  )
}