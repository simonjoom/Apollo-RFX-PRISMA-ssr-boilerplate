/*
 *
 * LanguageToggle
 *
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages';
import { changeLocale } from '../LanguageProvider/actions';
import { makeSelectLocale } from '../LanguageProvider/selectors';
import { Link } from 'rfx-link'

import CN_FLAG from './flag_zh.png';
import EN_FLAG from './flag_en.png';
import styles from './style.css';

export class LocaleToggle extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {locale} = this.props;
    const flag = locale === 'zh' ? CN_FLAG : EN_FLAG;
    const {formatMessage} = this.props.intl;
    
    return (
      <ul className={styles.ul}>
        <li className={styles.li} onClick={evt => this.props.onLocaleToggle(evt, 'zh')}>
          <span>{formatMessage(messages.zh)}</span>
          <Link activeClassName={(locale === 'zh') ? styles.active : ""} shouldDispatch={false} component="button">
            <img src={CN_FLAG}/>
          </Link>
        </li>
        <li className={styles.li} onClick={evt => this.props.onLocaleToggle(evt, 'en')}>
          <span>{formatMessage(messages.en)}</span>
          <Link activeClassName={(locale === 'en') ? styles.active : ""} shouldDispatch={false} component="button">
            <img src={EN_FLAG}/>
          </Link>
        </li>
      </ul>
    );
  }
}

LocaleToggle.propTypes = {
  onLocaleToggle: PropTypes.func,
  locale: PropTypes.string,
};

/*const mapStateToProps = createSelector(makeSelectLocale(), locale => ({
  locale,
}));
*/

const mapStateToProps = state => ({
  locale: state.language.locale,
});


export function mapDispatchToProps(dispatch) {
  return {
    onLocaleToggle: (evt, locale) => dispatch(changeLocale(locale)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LocaleToggle));

// <a href="javascript:void(0)" className="capitalize action-lang-en">