import {ImageSourcePropType} from 'react-native';

import HomeIcon from './home_icon.svg';
import CloseIcon from './close_icon.svg';
import DoneIcon from './done_icon.svg';
import BoxIcon from './box_icon.svg';

export const imageAssets = {
  login: require('./login.png') as ImageSourcePropType,
  register: require('./register.png') as ImageSourcePropType,

  imageIcon: require('./image_icon.png') as ImageSourcePropType,
  captureIcon: require('./capture_icon.png') as ImageSourcePropType,
  imageGalleryIcon: require('./image_gallery_icon.png') as ImageSourcePropType,
  settingIcon: require('./setting_icon.png') as ImageSourcePropType,
  cryingIcon: require('./crying_icon.png') as ImageSourcePropType,
  starIcon: require('./star_icon.png') as ImageSourcePropType,
  capturePlaceIcon: require('./capture_place_icon.png') as ImageSourcePropType,
  shareIcon: require('./share_icon.png') as ImageSourcePropType,
  pickupPointIcon: require('./pickup_point_icon.png') as ImageSourcePropType,
  paperMapIcon: require('./paper_map_icon.png') as ImageSourcePropType,
  rightArrowIcon: require('./right_icon.png') as ImageSourcePropType,
  leftArrowIcon: require('./left_icon.png') as ImageSourcePropType,
};

export const svgAssets = {
  homeIcon: HomeIcon,
  boxIcon: BoxIcon,
  closeIcon: CloseIcon,
  doneIcon: DoneIcon,
};