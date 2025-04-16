import config from '../config.json';

const imagePath = (img: string) => config.imageDomain + img;

export default imagePath;
