import React from 'react';
import { Provider } from '@storybook/ui';
import addons from '@storybook/addons';
import '@storybook/addon-viewport/register';
import '@storybook/addon-storysource/register';
export default class MyProvider extends Provider {
  constructor() {
    super();

    // const channel = createChannel({ page: 'manager' });

    // addons.setChannel(channel);
    // channel.emit(Events.CHANNEL_CREATED);

    this.addons = addons
    this.channel = {
      on: () => {
        console.log('on')
       },
      off: () => { 
        console.log('off')
      },
      emit: (event, {storyId}) => { 
        if (event == 'setCurrentStory') {
          console.log('changeCurrentStory')
          console.log(storyId)
        }
      },
      addPeerListener: (data) => { 
        console.log(data)
      },
    };
  }

  getElements(type) {
    return this.addons.getElements(type) || {};
  }

  renderPreview() {
    return (
      <iframe
          id="storybook-preview-iframe"
          src="http://dotwe.org/raw/htmlVue/2b7cccf16ca50c4e7a9dcc3ac52fdb28?1568382320901&p=true"
          title="string"
        />
      // <p>This is the Preview</p>
    );
  }

  handleAPI(api) {
    console.log(this)
    console.log(api)
    this.addons.loadAddons(api)
    this.api = api
    // console.log(api, 'api')
    // console.log(api.getPanels())
    // console.log(withStorySource)
    // withStorySource('...')(() => false, {
    //   id: 'app--to-storybook',

    // })
    // addSourceDecorator()
    // api.emit('storybook/storysource/set', {
    //   source: 'source',
    // // currentLocation: currentLocation,
    // // locationsMap: locationsMap
    // })
    // this.addons.getChannel()
    setTimeout(() => {
    //   console.log('setStories')
      api.setStories([
        {
          id: "app--to-storybook",
          kind: "App",
          name: "to Storybook",
          parameters: {
            viewport: {
              defaultViewport: "iphone6"
            },
            source: "to Storybook"
          },
          story: "to Storybook",
        },
        {
          id: "button--with-jsx",
          kind: "Button",
          name: "with JSX",
          parameters: {
            viewport: {
              defaultViewport: "iphone6"
            },
            source: "to Storybook"
          },
        },
        {
          id: "button--with-some-emoji",
          kind: "Button",
          name: "with-some-emoji",
          parameters: {
            viewport: {
              defaultViewport: "iphone6"
            },
            source: "to Storybook"
          },
        }
      ]);

    }, 0)


    // no need to do anything for now.
  }
}