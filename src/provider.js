import React from 'react';
import { Provider } from '@storybook/ui';
import addons from '@storybook/addons';
import '@storybook/addon-viewport/register';
export default class MyProvider extends Provider {
  constructor() {
    super();
    this.addons = addons
    this.channel = {
      on: () => { },
      off: () => { },
      emit: () => { },
      addPeerListener: () => { },
    };
  }
  getElements(type) {
    return {};
  }

  renderPreview() {
    return (
      <p>This is the Preview</p>
    );
  }

  handleAPI(api) {
    console.log(this)
    console.log(api)
    this.addons.loadAddons(api)
    setTimeout(() => {
      api.setStories([
        {
          id: "app--to-storybook",
          kind: "App",
          name: "to Storybook",
          parameters: {
            viewport: {
              defaultViewport: "iphone6"
            }
          }
        },
        {
          id: "button--with-jsx",
          kind: "Button",
          name: "with JSX",
        },
        {
          id: "button--with-some-emoji",
          kind: "Button",
          name: "with-some-emoji",
        }
      ]);
    }, 2000)

    // no need to do anything for now.
  }
}