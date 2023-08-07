export function removeSpecialChar(str) {
  const specialChars = ["'", '"', ",", ";", "<", ">"];
  let result = str;
  for (const char of specialChars) {
    result = result.split(char).join(" ");
  }
  return result;
}
