import React from "react";

const uploadPicture = (file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = () => {
        reject(file);
      };
    } else {
      reject();
    }
  });
};

export default uploadPicture;
