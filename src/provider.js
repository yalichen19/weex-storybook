import React from 'react';
import { Provider } from '@storybook/ui';
import addons from '@storybook/addons';
import './addon-viewport/register';
import './addon-storysource/register';
export default class MyProvider extends Provider {
  constructor() {
    super();
    this.addons = addons
    this.channel = {
      on: () => {},
      off: () => {},
      emit: () => {},
      addPeerListener: () => {},
    };
  }

  getElements(type) {
    return this.addons.getElements(type) || {};
  }

  renderPreview = (storyId) => {
    if (!storyId) return null;
    return (
      <iframe
          id="storybook-preview-iframe"
          src={"./iframe.html?id=" + storyId}
        />
    );
  }

  handleAPI(api) {
    console.log(this)
    console.log(api, 'api')
    this.addons.loadAddons(api)
    setTimeout(() => {
      api.setStories(STORYBOOK_STORIES)
    }, 1000)
  }
}