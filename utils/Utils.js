export function removeSpecialChar(str) {
  const specialChars = ["'", '"', ",", ";", "<", ">"];
  let result = str;
  for (const char of specialChars) {
    result = result.split(char).join(" ");
  }
  return result;
}

export function validateParameters(params) {
  for (const key in params) {
    if (!params[key] && params[key] === '') {
      return { response: false, type: key };
    }
  }

  return { response: true };
}
