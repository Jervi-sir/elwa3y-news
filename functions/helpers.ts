import * as Notifications from 'expo-notifications';
import * as ImageManipulator from 'expo-image-manipulator';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const InvertColor = (hex) => {
  const color = (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
  return `#${'0'.repeat(6 - color.length)}${color}`;
}

const uriToBase64 = async (imageUri) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{resize: {width: 720}}],
    {base64: true, format: ImageManipulator.SaveFormat.JPEG}
  );

  return manipResult.base64;
};

export const compressImage = async (imageUri) => {
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri, 
    [{resize: {width: 720}}], // compress to width of 500
    {compress: 0.1, format: ImageManipulator.SaveFormat.JPEG, base64: true} // compress quality and format
  );

  return manipResult.uri;
}

export async function compressAndEncodeImage(imageUri) {
  const compressedUri = await compressImage(imageUri);
  const base64 = await uriToBase64(compressedUri);
  return base64;
}

export const showServerError = (error) => {
  return error.response.data;
}

export const timeSince = (myDate) => {
  const date = new Date(myDate)
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsPast < 60) {
    return `${secondsPast} ثانية`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)} دقيقة`;
  }
  if (secondsPast <= 86400) {
    return `${Math.floor(secondsPast / 3600)} ساعة`;
  }
  if (secondsPast > 86400) {
    const day = Math.floor(secondsPast / 86400);
    if (day <= 7) {
      return `${day} يوم`;
    }
    if (day <= 30) {
      const week = Math.ceil(day / 7);
      return `${week} أسبوع`;
    }
    if (day <= 365) {
      const month = Math.ceil(day / 30);
      return `${month} شهر`;
    }
    if (day > 365) {
      const year = Math.floor(day / 365);
      return `${year} سنة`;
    }
  }
}

export const TimeAgo = (isoTime) => {
  const now = new Date();
  const past = new Date(isoTime);
  const secondsAgo = Math.floor((now - past) / 1000);

  let interval = secondsAgo / 31536000;

  if (interval > 1) {
    if(interval == 1) { return formateDateAgo('', "سنة") }
    if(interval == 2) { return formateDateAgo('', "سنتين") }
    if(interval > 10) { return formateDateAgo(Math.floor(interval), "سنة") }
    if(interval > 2) { return formateDateAgo(Math.floor(interval), "سنوات") }
  }
  interval = secondsAgo / 2592000;
  if (interval > 1) {
    if(interval == 1) { return formateDateAgo('', "شهر") }
    if(interval == 2) { return formateDateAgo('', "شهرين") }
    if(interval > 2) { return formateDateAgo(Math.floor(interval), "أشهر") }
  }
  interval = secondsAgo / 604800;
  if (interval > 1) {
    if(interval == 1) { return formateDateAgo('', "أسبوع") }
    if(interval == 2) { return formateDateAgo('', "أسبوعين") }
    if(interval > 2) { return formateDateAgo(Math.floor(interval), "أسابيع") }
  }
  interval = secondsAgo / 86400;
  if (interval >= 1) {
    if(interval == 1) { return formateDateAgo('', "يوم") }
    if(interval == 2) { return formateDateAgo('', "يومين") }
    if(interval > 2) { return formateDateAgo(Math.floor(interval), "أيام") }
  }
  interval = secondsAgo / 3600;
  if (interval >= 1) {
    if(interval == 1) { return formateDateAgo('', "ساعة") }
    if(interval == 2) { return formateDateAgo('', "ساعتين") }
    if(interval > 10) { return formateDateAgo(Math.floor(interval), "ساعة") }
    if(interval > 2) { return formateDateAgo(Math.floor(interval), "ساعات") }
  }
  interval = secondsAgo / 60;
  if (interval >= 1) {
    if(interval == 1) { return formateDateAgo('', "دقيقة") }
    if(interval == 2) { return formateDateAgo('', "دقيقتين") }
    if(interval > 2) { return formateDateAgo(Math.floor(interval), "دقائق") }
  }
  return "منذ ثوانى"; //Math.floor(secondsAgo) + " " + 
};
const formateDateAgo = (number, suffix) => {
  return "منذ" + " " + number + " " + suffix;
}