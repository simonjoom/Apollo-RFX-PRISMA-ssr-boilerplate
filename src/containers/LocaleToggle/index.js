/*
 *
 * LanguageToggle
 *
 */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import LocaleToggle from '../../components/LocaleToggle';
import { injectIntl } from 'react-intl';
import { changeLocale } from '../LanguageProvider/actions';
import { makeSelectLocale } from '../LanguageProvider/selectors';

/*const mapStateToProps = createSelector(makeSelectLocale(), locale => ({
  locale,
}));
*/

const mapStateToProps = state => ({
  locale: state.language.locale,
});

export function mapDispatchToProps(dispatch) {
  return {
    flags: [{id: 'fl0', type: "en"},
      {id: 'fl1', type: "pt"},
      {id: 'fl2', type: "ru"},
      {id: 'fl3', type: "uk"},
      {id: 'fl4', type: "fr"},
      {id: 'fl5', type: "zh"}],
    onLocaleToggle: (evt, locale) => dispatch(changeLocale(locale)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LocaleToggle));

// <a href="javascript:void(0)" className="capitalize action-lang-en">