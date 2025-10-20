export const checkIsBrokenImage = (url: string) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onerror = () => {
      resolve(false);
    };
    image.onload = () => {
      resolve(true);
    };
    image.src = url;
  });
};
