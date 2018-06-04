/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
//import { connect } from 'react-redux';
import { createSelector } from 'reselect'
import { IntlProvider } from 'react-intl'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { makeSelectLocale } from './selectors'

export class LanguageProvider extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={this.props.messages[this.props.locale]}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    )
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired
}

/*const mapStateToProps = createSelector(makeSelectLocale(), locale => ({
  locale,
}));*/
const GET_LANG = gql`
  query getLang {
    state {
    language @client {
      locale
          }
    }
  }
`


const WrappedLang = graphql(GET_LANG, {
  props: ({ loading, error, data: { state: { language: { locale } } } }) => {
    if (loading) {
      return { loading }
    }
    if (error) {
      return { error }
    }
    return {
      loading: false,
      locale
    }
  }
})(LanguageProvider)

export default WrappedLang
// export default connect(mapStateToProps)(LanguageProvider);
