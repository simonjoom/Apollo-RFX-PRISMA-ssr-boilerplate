import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'rfx-link'
import messages from './messages';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
//import CN_FLAG from './flag_zh.png';
//import EN_FLAG from './flag_en.png';
import styles from './style.css';
import {
  Icon_Flag_FR,
  Icon_Flag_RU,
  Icon_Flag_US,
  Icon_Flag_CH,
  Icon_Flag_UK,
  Icon_Flag_BR,
  //Icon_Skype,
} from './flags/';

const Localetosrc = {
  'zh': Icon_Flag_CH,
  'en': Icon_Flag_US,
  'fr': Icon_Flag_FR,
  'pt': Icon_Flag_BR,
  'ru': Icon_Flag_RU,
  'uk': Icon_Flag_UK
}

class LocaleToggle extends PureComponent {
  state = {
    openMenu: false,
    anchorEl: null
  }
  handleClick = (event) => {
    this.setState({openMenu: true, anchorEl: event.currentTarget});
  }
  handleRequestClose = () => this.setState({openMenu: false});
  
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {locale, flags} = this.props;
    const CurrentFlag = Localetosrc[locale];
    const {formatMessage} = this.props.intl;
    return (
      <div>
        <Button
          aria-haspopup="true"
          className={styles.ul}
          style={{position:"fixed"}}
          onClick={this.handleClick}
        >
          <CurrentFlag/>
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.el}
          open={this.state.openMenu}
          onClose={this.handleRequestClose}
        >
          {flags.map(flag => {
            let Flag = Localetosrc[flag.type];
            const msg=formatMessage(messages[flag.type]);
            return (<MenuItem key={flag.id} className={styles.li}
              onClick={evt => this.props.onLocaleToggle(evt, flag.type)}>
              <Link activeClassName={(locale === flag.type) ? styles.active : ""} shouldDispatch={false}
                    component="a" title={msg}>
                <span>{msg}</span>
                <Flag/>
              </Link>
            </MenuItem>)
          })
          }
        </Menu>
      </div>
    );
  }
}

LocaleToggle.propTypes = {
  onLocaleToggle: PropTypes.func,
  locale: PropTypes.string,
};
export default LocaleToggle;
