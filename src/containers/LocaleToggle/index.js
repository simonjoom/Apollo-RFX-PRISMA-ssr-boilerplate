/*
 *
 * LanguageToggle
 *
 */
import React from 'react'
import LocaleToggle from '../../components/LocaleToggle'
import { changeLocale } from '../LanguageProvider/actions'
//import { makeSelectLocale } from '../LanguageProvider/selectors';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
/* const mapStateToProps = createSelector(makeSelectLocale(), locale => ({
  locale,
}));

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
*/
const GET_LANG = gql`
  query getLang {
    state @client {
    language @client {
      locale
      }
    }
  }
`

const SET_LANG = gql`
mutation($locale:String) {
 setLocale(locale:$locale) @client {
  language {
  locale
  }
 }
 }
 `;
const WrappedLocaleToggle = compose(
  graphql(GET_LANG, {
    props: ({ loading, error, data: { state: { language: { locale } } } }) => {
      if (loading) {
        return { loading }
      }
      if (error) {
        return { error }
      }
      return {
        loading: false,
        flags: [{ id: 'fl0', type: 'en' },
        { id: 'fl1', type: 'pt' },
        { id: 'fl2', type: 'ru' },
        { id: 'fl3', type: 'uk' },
        { id: 'fl4', type: 'fr' },
        { id: 'fl5', type: 'zh' }],
        locale
      }
    }
  }),
  (graphql(SET_LANG, {
    props: ({ mutate }) => {
      return {
        onLocaleToggle: (e, loc) => {
          console.log('localetoggle', loc)
          return mutate({ variables: { locale: loc } })
          //return graphql(SET_LANG)({ locale: loc })
        }
      }
    }
  }))
)(LocaleToggle)

export default WrappedLocaleToggle

// export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LocaleToggle));

// <a href="javascript:void(0)" className="capitalize action-lang-en">
