const isEmpty = (string) => {
  if (string.trim() == "") {
    return true;
  } else return false;
};

const isUserFieldEmpty = (email, password, handle, errors) => {
  let isempty = false;

  if (email.trim() == "") {
    errors.email = "Must not be empty";
    isempty = true;
  }

  if (password.trim() == "") {
    errors.password = "Must not be empty";
    isempty = true;
  }

  if (handle.trim() == "") {
    errors.handle = "Must not be empty";
    isempty = true;
  } else return isempty;

  return isempty;
};

const isWhiteSpace = (emial, password, handle, errors) => {
  let iswhitespace = false;
  const regex = /\s/;

  if (emial.match(regex)) {
    errors.email = "Must not contain whitespace";
    iswhitespace = true;
  }

  if (password.match(regex)) {
    errors.password = "Must not contain whitespace";
    iswhitespace = true;
  }

  if (handle.match(regex)) {
    errors.handle = "Must not contain whitespace";
    iswhitespace = true;
  } else {
    return iswhitespace;
  }

  return iswhitespace;
};

const validateUser = (email, password, handle, errors) => {
  if (isUserFieldEmpty(email, password, handle, errors)) {
    return true;
  } else if (isWhiteSpace(email, password, handle, errors)) {
    return true;
  }

  return false;
};

const validateMimeType = (mimetype) => {
  switch (mimetype) {
    case "image/jpeg":
      return true;

    case "image/png":
      return true;

    case "image/gif":
      return true;

    case "image/jpg":
      return true;

    case "video/mp4":
      return true;

    default:
      return false;
  }
};

const reduceUserDetails = (data) => {
  let userDetails = {};
  let errors = {};

  if (!isEmpty(data.bio.trim())) {
    if (data.bio.length < 200) {
      userDetails.bio = data.bio;
    } else {
      errors.bio = "Bio can't be longer than 50 characters";
    }
  }
  if (!isEmpty(data.website.trim())) {
    if (data.website.length < 150) {
      if (data.website.trim().substring(0, 4) !== "http") {
        userDetails.website = "http://" + data.website.trim() + "";
      } else {
        userDetails.website = data.website;
      }
    } else {
      errors.website = "Webiste can't be longer than 150 characters";
    }
  }
  if (!isEmpty(data.location.trim())) {
    if (data.location.length < 50) {
      userDetails.location = data.location;
    } else {
      errors.location = "Location can't be longer than 50 characters'";
    }
  }

  return {
    userDetails,
    valid: Object.keys(errors).length === 0 ? true : false,
    errors,
  };
};

const max50char = (string) => {
  if (string.length > 50) {
    return false;
  }

  return true;
};

const max100char = (string) => {
  if (string.length > 100) {
    return false;
  }

  return true;
};

const max12char = (string) => {
  if (string.length > 100) {
    return false;
  }

  return true;
};

const max200char = (string) => {
  if (string.length > 200) {
    return false;
  }

  return true;
};

const isUndefined = (email, password, errors) => {
  let undefined = false;
  if (typeof email === "undefined") {
    console.log("HANLDE", email);
    errors.email = "must not be empty!";
    undefined = true;
  }

  console.log("PASSWORD", password);
  if (typeof password === "undefined") {
    errors.password = "must not be empty!";
    undefined = true;
  }
  return undefined;
};

module.exports = {
  validateUser,
  validateMimeType,
  reduceUserDetails,
  isEmpty,
  isUndefined,
  max12char,
  max50char,
  max100char,
};
