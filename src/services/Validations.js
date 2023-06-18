//data = {name, surname, email, password}
exports.registrationValidation = (data) => {
  const required_keys = ["name", "surname", "email", "password"];
  const keys = Object.keys(data);
  const missing_keys = required_keys.filter((key) => !keys.includes(key));
  if (missing_keys.length > 0) {
    return `Missing data: ${missing_keys}`;
  }

  let message = "";

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (typeof data[key] !== "string") {
      message = `${key} is not a string`;
      break;
    }
    let item = data[key].trim();

    if (item === "") {
      message = `${key} is empty`;
      break;
    }
    if (item.length > 50) {
      message = `${key} is too long`;
      break;
    }
    if (key === "email") {
      if (!item.includes("@")) {
        message = `${key} is not a valid email`;
        break;
      }
    }
    if (key === "password") {
      if (item.length < 8) {
        message = `${key} is too short`;
        break;
      }
    }
    message = "valid";
  }
  return message;
};
