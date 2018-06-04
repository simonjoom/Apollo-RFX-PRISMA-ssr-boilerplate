import { createSelector } from 'reselect';

/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = state => {
  return state.language;
}
const languageState = state => {
  return state.locale;
}
/**
 * Select the language locale
 */
const makeSelectLocale = (state) =>
  createSelector(selectLanguage, languageState)(state);

export { selectLanguage, makeSelectLocale };
