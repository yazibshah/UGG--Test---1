// passcode.js

let passcode = null;

// Set passcode
const setPasscode = (code) => {
  passcode = code;
};

// Verify passcode
const verifyPasscode = (code) => {
  return passcode === code;
};

module.exports = {
  setPasscode,
  verifyPasscode
};
