import React, { Component } from 'react'
import { AUTH_TOKEN } from '../../constants'
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import withStyle from '@material-ui/core/styles/withStyles';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const styleSheet = {
  menu: {},
  content: {
    margin: 0,
  },
};

function handleLogout() {
  // dispatch('auth.logout');
}

class MyMenu extends Component {
  handleSettings = (e) => {
    this.props.handleRequestClose()
    // dispatch('modal.accountModal.showCreateAccountModal', 'open');
  }
  
  render() {
    const {classes, open, anchorEl, handleRequestClose} = this.props;
    return (<Menu
      id="simple-menu"
      anchorEl={anchorEl}
      className={classes.menu}
      open={open}
      onClose={handleRequestClose}
    >
      <MenuItem onClick={handleRequestClose}>Profile</MenuItem>
      <MenuItem onClick={this.handleSettings}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>)
  }
}

const MyMenyS = withStyle(styleSheet)(MyMenu)

class Login extends Component {
  
  static contextTypes = {
    xs: PropTypes.bool,
    sm: PropTypes.bool,
    md: PropTypes.bool,
    lg: PropTypes.bool
  };
  
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
    top: false,
    left: true,
    bottom: false,
    right: false,
    showPassword: false,
    openMenu: false,
    anchorEl:null
  }
  
  handleMouseDownPassword = event => {
    event.preventDefault();
  };
  handleClickShowPassword = () => {
    this.setState({showPassword: !this.state.showPassword});
  };
  
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };
  
  constructor(props: Object, context: Object) {
    super(props, context);
    console.log("Logincontext", context)
  }
  
  handleChange = prop => event => {
    this.setState({[prop]: event.target.value});
  };
  handleClick = (event) => this.setState({openMenu: true, anchorEl: event.currentTarget});
  handleRequestClose = () => this.setState({openMenu: false});
  
  render() {
    console.log("Logincontext", this.context, this.props.context)
    return (
      <div>
        <Button onClick={this.toggleDrawer('left', true)}>Open Left</Button>
        <SwipeableDrawer disableBackdropTransition={!iOS} disableDiscovery={iOS}
                         open={this.state.left} onClose={this.toggleDrawer('left', false)}
                         onOpen={this.toggleDrawer('left', true)}>
          <h4 className="mb-3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
          <div className="flex flex-column">
            <Button onClick={this.toggleDrawer('left', false)} className="left">Close X</Button>
            
            {!this.state.login && (
              <Input
                value={this.state.name}
                onChange={e => this.setState({name: e.target.value})}
                type="text"
                placeholder="Your name"
              />
            )}
            <FormControl>
              <InputLabel htmlFor="adornment-email">Email</InputLabel>
              <Input
                id="adornment-email"
                value={this.state.email}
                onChange={this.handleChange('email')}
                placeholder="Your email address"
              />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="adornment-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                placeholder="Choose a safe password"
                onChange={this.handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? <i className="fa fa-eye fa-2x"/> :
                        <i className="fa fa-eye fa-2x"/>}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <div className="flex mt3">
                <Button className="button" onClick={() => this._confirm()}>
                  {this.state.login ? 'login' : 'create account'}
                </Button>
                <Button
                  className="pointer button"
                  onClick={() => this.setState({login: !this.state.login})}
                >
                  {this.state.login
                    ? 'need to create an account?'
                    : 'already have an account?'}
                </Button>
              </div>
            </FormControl>
            <Button
              aria-owns="simple-menu"
              aria-haspopup="true"
              onClick={this.handleClick}
            > {this.props.getemail || "Whenconnected"}
              <i className="fa fa-caret-down"/>
            </Button>
            
            <MyMenyS open={this.state.openMenu} anchorEl={this.state.anchorEl}
                     handleRequestClose={this.handleRequestClose}/>
          </div>
        </SwipeableDrawer>
      </div>
    )
  }
  
  _confirm = async () => {
    const {name, email, password} = this.state
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password,
        },
      })
      const {token} = result.data.login;
      console.log("isToken", result.data)
      this._saveUserData(token)
    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password,
        },
      })
      const {token} = result.data.signup
      this._saveUserData(token)
    }
    //this.props.history.push(`/`)
  }
  
  _saveUserData = (token) => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

export default compose(
  graphql(SIGNUP_MUTATION, {name: 'signupMutation'}),
  graphql(LOGIN_MUTATION, {name: 'loginMutation'}),
)(Login)