import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Button from '@material-ui/core/Button';

import {
  DirectionsRun,
  Pause,
} from '@material-ui/icons'

function TabContainer(props) {
  const { children, dir } = props;

  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};


class FloatingActionButtonZoom extends React.Component {
  state = {
    value: 0,
    active: false,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  toggleActive = () => this.setState({ active: !this.state.active })

  render() {
    const {
      active
    } = this.props;
    
    const transitionDuration = {
      enter: 300,
      exit: 60,
    };

    const index = 0;
    return (
      <div>
        <Zoom
          in={!active}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${!active ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Button
            variant="fab"
            color={'primary'}
            onClick={this.props.start}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px'
            }}
          >
            <DirectionsRun />
          </Button>
        </Zoom>
        <Zoom
          in={active}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${active ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Button
            variant='fab'
            color={'primary'}
            onClick={this.props.stop}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              background: '#fb0b6a',
            }}
          >
            <Pause />
          </Button>
        </Zoom>
      </div>
    );
  }
}

FloatingActionButtonZoom.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


export default FloatingActionButtonZoom;
