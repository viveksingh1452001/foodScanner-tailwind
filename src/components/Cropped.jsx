// cropImage.js
export default async function getCroppedImg(imageSrc, pixelCrop) {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const scaleFactor=1;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  
    ctx.drawImage(
      image,
      pixelCrop.x * scaleFactor,
  pixelCrop.y * scaleFactor,
  pixelCrop.width * scaleFactor,
  pixelCrop.height * scaleFactor,
      0,
      0,
      pixelCrop.width*scaleFactor,
      pixelCrop.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    });
  }
  