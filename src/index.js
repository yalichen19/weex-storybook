import renderStorybookUI from '@storybook/ui';
import Provider from './provider';

const roolEl = document.getElementById('root');
renderStorybookUI(roolEl, new Provider());