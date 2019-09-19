import { ADDON_ID, PANEL_ID, EVENT_ID } from './events';

export { ADDON_ID, PANEL_ID, EVENT_ID };

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
