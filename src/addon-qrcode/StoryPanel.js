import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EVENT_ID } from './events';
import QRCode from 'qrcode.react'

const getLocationKeys = locationsMap =>
  locationsMap
    ? Array.from(Object.keys(locationsMap)).sort(
        (key1, key2) => locationsMap[key1].startLoc.line - locationsMap[key2].startLoc.line
      )
    : [];

export default class StoryPanel extends Component {

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;

    api.on(EVENT_ID, this.listener);
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
    const { api } = this.props;

    api.off(EVENT_ID, this.listener);
  }


  listener = ({ edition: { source }, location: { currentLocation, locationsMap } }) => {
    const locationsKeys = getLocationKeys(locationsMap);
    this.setState({
      source,
      currentLocation,
      locationsMap,
      locationsKeys,
    });
  };

  render() {
    const { active, api } = this.props;
    const currentStory = api && api.getCurrentStoryData();
    const id = currentStory && currentStory.id;
    const {origin, pathname} = location;
    const weexUrl = `${origin}${pathname}dist/${id}.weex.js`;
    return active && id ? (
      <div style={{padding: '30px'}}>
        <a href={ weexUrl}>
          <QRCode value={ weexUrl} size={200} />
        </a>
      </div>
    ) : null;
  }
}

StoryPanel.propTypes = {
  active: PropTypes.bool.isRequired,
  api: PropTypes.shape({
    selectStory: PropTypes.func.isRequired,
    emit: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
  }).isRequired,
};
