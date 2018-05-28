import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { hot } from 'react-hot-loader'
import Sidebar from './Sidebar'
import Switcher from './Switcher'
import Login from './Login'
import styles from '../css/App'
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import LocaleToggle from '../containers/LocaleToggle';
import LanguageProvider from '../containers/LanguageProvider';
import { translationMessages } from '../i18n';
import Paper from '@material-ui/core/Paper'

import withWidth from './withWidth' //taken from @material-ui/core

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
  
  constructor(props: Object, context: Object) {
    super(props, context);
    this.width = this.props.width || "md";
  }
  
  createDefaultContext() {
    let context = this.props.context;
    let width = this.props.width || this.width;
    return {
      ...context,
      xs: "xs" == width,
      sm: "sm" == width,
      md: "md" == width,
      lg: "lg" == width,
    };
  }
  
  componentWillMount() {
    this.savecontext = this.createDefaultContext();
  }
  
  componentWillUpdate() {
    this.savecontext = this.createDefaultContext();
  }
  
  getChildContext() {
    return this.savecontext;
  }
  
  render() {
    const {xs, sm} = this.savecontext;
    const cls = cx({"m0": xs, "m1": sm, "m2": !xs && !sm}, styles.app);
    return (
      <Paper className={cls}>
        <FormattedMessage id='app.containers.Home.welcome'/>
        <LocaleToggle/>
        <Login/>
        <Sidebar/>
        <Switcher/>
      </Paper>
    )
  }
}

const ResponsiveApp = hot(module)(withWidth({initialWidth: "md"})(CApp));

const App = ({feedQuery, ...props}) => {
  const renderFn = (messages) => (
    <LanguageProvider messages={messages}>
      <ResponsiveApp/>
    </LanguageProvider>
  );
  console.log("testss")
  if ((typeof widow !== "undefined") && !window.Intl) {
    return new Promise(resolve => {
      resolve(import('intl'));
    })
    .then(() => Promise.all([
        import('intl/locale-data/jsonp/en.js'),
        import('intl/locale-data/jsonp/zh.js'),
        import('intl/locale-data/jsonp/fr.js'),
        import('intl/locale-data/jsonp/uk.js'),
        import('intl/locale-data/jsonp/ru-RU.js'),
        import('intl/locale-data/jsonp/pt-BR.js')
      ])
    )
    .then(() => renderFn(translationMessages))
    .catch(err => {
      throw err;
    });
  } else {
    return renderFn(translationMessages);
  }
  
}

export default App
