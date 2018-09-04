import React, { Component } from 'react';
// import firebase from 'firebase';
import ReactTimeout from 'react-timeout'
import Fullscreen from "react-full-screen";
import GUI from '../GUI';
import Map from '../Map';
import Loading from './Loading.png';
import './style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      oldPoints: [],
      newPoints: [],
      size: 0.003,
    }
    // firebase.auth().onAuthStateChanged(this.userStateChange);
    this.lockedState = false;
  }
  componentWillUnmount() {
    this.stopHandler();
  }
  componentDidMount() {
    this.setState({ oldPoints: JSON.parse(localStorage.getItem('points') || '[]') })
  }
  // shouldComponentUpdate(props, state) {
  //   if (this.lockedState && this.state.active) {

  //   }

  // }
  // userStateChange = async user => {
  //   if (user) {
  //     this.setState({ user });
  //     return;
  //   }
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   const result = await firebase.auth().signInWithRedirect(provider)
  //   this.setState({
  //     token: result.credential.accessToken,
  //   });
  // }
  activeStep = () => {
    if (!navigator.geolocation) {
      console.log('no geolocation found');
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      if (!this.interval) {
        return;
      }
      const newCoord = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      const lastPoint = this.state.newPoints[0];
      if (lastPoint) {
        const a = lastPoint.lat - newCoord.lat;
        const b = lastPoint.lng - newCoord.lng;
        const distance = Math.sqrt(a*a + b*b);
        if (distance < this.state.size / 2) {
          return;
        }
      }
      console.log(newCoord, 'added to points');
      debugger;
      this.setState({ newPoints: [...this.state.newPoints, newCoord], focus: newCoord })
    })
  }
  stopHandler = () => {
    clearInterval(this.interval)
    const newOldPoints = [...this.state.oldPoints, ...this.state.newPoints];
    this.setState({ active:false, oldPoints: newOldPoints, newPoints: [], active: false }, () => {
      localStorage.setItem('points', JSON.stringify(newOldPoints));
    })
  }
  startHandler = () => {
    this.setState({ active: true }, () => {
      this.interval = setInterval(
        this.activeStep,
        1000,
      );
    })
  }
  renderWithAuth() {
    return (
      <Fullscreen
        enabled={this.state.active}
        onChange={isFull => this.setState({isFull})}
      >
        <Map
          outer={[
            {"lat":53.86052163377647,"lng":27.34381718063355},
            {"lat":54.02057519825325,"lng":27.33832401657105},
            {"lat":54.0286424276716,"lng":27.68439335250855},
            {"lat":53.870239334124754,"lng":27.82721561813355},
            {"lat":53.76484396689097,"lng":27.6047424736023}
          ]}
          points={[
            ...this.state.oldPoints, 
            ...this.state.newPoints,
          ]}
          fixed = {this.state.active}
          focus = {this.state.focus}
          blockSize = {this.state.size}
        />
        <GUI
          active={this.state.active}
          stop={this.stopHandler}
          start={this.startHandler}
        />
      </Fullscreen>
    )
  }
  renderAnonimous() {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          className='rotatable'
          src={Loading}
        />
      </div>
    )
  }
  render() {
    const { user } = this.state;

    if (true) {
      return this.renderWithAuth();
    }
    return this.renderAnonimous();
  }
}

export default ReactTimeout(App);
