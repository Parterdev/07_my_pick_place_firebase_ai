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
  synchronizeIcon: require('./synchronize_icon.png') as ImageSourcePropType,
  toggleOnIcon: require('./toggle_on_icon.png') as ImageSourcePropType,
  toggleOffIcon: require('./toggle_off_icon.png') as ImageSourcePropType,
  catIcon: require('./cat_icon.png') as ImageSourcePropType,
  bearIcon: require('./bear_icon.png') as ImageSourcePropType,
  octopusIcon: require('./octopus_icon.png') as ImageSourcePropType,
  dogIcon: require('./dog_icon.png') as ImageSourcePropType,
  elephantIcon: require('./elephant_icon.png') as ImageSourcePropType,
  rabbitIcon: require('./rabbit_icon.png') as ImageSourcePropType,
  butterflyIcon: require('./butterfly_icon.png') as ImageSourcePropType,
  fireIcon: require('./fire_icon.png') as ImageSourcePropType,
  cloudIcon: require('./cloud_icon.png') as ImageSourcePropType,
  recoverIcon: require('./recover_email_icon.png') as ImageSourcePropType,
  botIcon: require('./bot_icon.png') as ImageSourcePropType,
  sunIcon: require('./sun_icon.png') as ImageSourcePropType,
  moonIcon: require('./moon_icon.png') as ImageSourcePropType,
};

export const svgAssets = {
  homeIcon: HomeIcon,
  boxIcon: BoxIcon,
  closeIcon: CloseIcon,
  doneIcon: DoneIcon,
};