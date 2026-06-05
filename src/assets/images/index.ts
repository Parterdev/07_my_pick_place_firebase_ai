import {ImageSourcePropType} from 'react-native';

import HomeIcon from './home_icon.svg';
import CloseIcon from './close_icon.svg';
import DoneIcon from './done_icon.svg';

export const imageAssets = {
  login: require('./login.png') as ImageSourcePropType,
  register: require('./register.png') as ImageSourcePropType,

  imageIcon: require('./image_icon.png') as ImageSourcePropType,
  captureIcon: require('./capture_icon.png') as ImageSourcePropType,
  imageGalleryIcon: require('./image_gallery_icon.png') as ImageSourcePropType,
  settingIcon: require('./setting_icon.png') as ImageSourcePropType,
  cryingIcon: require('./crying_icon.png') as ImageSourcePropType,
  starIcon: require('./star_icon.png') as ImageSourcePropType,
};

export const svgAssets = {
  homeIcon: HomeIcon,
  closeIcon: CloseIcon,
  doneIcon: DoneIcon,
};