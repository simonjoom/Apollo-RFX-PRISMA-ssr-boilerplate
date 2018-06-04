import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { hot } from 'react-hot-loader'
import Sidebar from './Sidebar'
import Switcher from './Switcher'
import Login from './Login'
import styles from '../css/App'
import cx from 'classnames'
import { FormattedMessage } from 'react-intl'
import LocaleToggle from '../containers/LocaleToggle'
import LanguageProvider from '../containers/LanguageProvider'
import { translationMessages } from '../i18n'
import Paper from '@material-ui/core/Paper'

import withWidth from './withWidth' // taken from @material-ui/core

const SSR = (typeof window === 'undefined')
class CApp extends Component {
  static contextTypes = {
    xs: PropTypes.bool,
    sm: PropTypes.bool,
    md: PropTypes.bool,
    lg: PropTypes.bool
  };
  static childContextTypes = {
    xs: PropTypes.bool,
    sm: PropTypes.bool,
    md: PropTypes.bool,
    lg: PropTypes.bool
  };
  getChildContext() {
    return this.savecontext
  }

  componentWillMount() {
    this.savecontext = this.createDefaultContext()
  }
  componentWillUpdate({ width }) {
    this.update = true
    this.savecontext = this.createDefaultContext(width)
  }
  createDefaultContext(width) {
    const context = this.props.context
    const wd = width || this.props.width
    console.log('createDefaultContext', wd)
    return {
      ...context,
      xs: wd == 'xs',
      sm: wd == 'sm',
      md: wd == 'md',
      lg: wd == 'lg'
    }
  }


  render() {
    const { xs, sm } = this.savecontext
    const cls = cx({ m0: xs, m1: sm, m2: !xs && !sm }, styles.app)
    if (!SSR && !this.update) { return <div /> }
    return (<Paper className={cls}>
      <FormattedMessage id='app.containers.Home.welcome' />
      <LocaleToggle />
      <Sidebar/>
      <Login />
      <Switcher />
    </Paper>
    )
  }
}
const ResponsiveApp = withWidth()(CApp)

const App = ({ feedQuery, ...props }) => {
  const renderFn = messages => (
    <LanguageProvider messages={messages}>
      <ResponsiveApp initialWidth='xs' />
    </LanguageProvider>
  )
  if (!SSR && !window.Intl) {
    return new Promise(resolve => {
      resolve(import('intl'))
    })
      .then(() => Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/zh.js'),
        import('intl/locale-data/jsonp/fr.js'),
        import('intl/locale-data/jsonp/uk.js'),
        import('intl/locale-data/jsonp/ru-RU.js'),
        import('intl/locale-data/jsonp/pt-BR.js')
      ]))
      .then(() => renderFn(translationMessages))
      .catch(err => {
        throw err
      })
  }
  return renderFn(translationMessages)
}

export default App