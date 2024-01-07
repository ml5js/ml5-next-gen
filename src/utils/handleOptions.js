/**
 * This function takes in an object of options and an object of molds.
 * Filters the options based on the moldObject and returns the filtered options.
 * Logs out friendly warnings if the user options are not of the correct type or value.
 *
 * @param {object} optionsObject - options provided by the user
 * @param {object} moldObject - an object defining how the user option should be filtered
 * @returns {object} - filtered options
 */
function handleOptions(optionsObject, moldObject) {
  const options = {};

  for (const key in moldObject) {
    const userValue = optionsObject[key];
    const type = moldObject[key].type;
    const defaultValue = moldObject[key].default;

    if (userValue === undefined) {
      options[key] = defaultValue;
    } else if (typeof userValue !== type && type !== "enum") {
      console.warn(
        `The value of ${key} is not of type ${type}. Using default value ${defaultValue} instead.`
      );
      options[key] = defaultValue;
    } else {
      if (type === "enum") {
        const enums = moldObject[key].enums;
        const caseInsensitive = moldObject[key].caseInsensitive ?? true;
        if (caseInsensitive && typeof userValue === "string") {
          enums.forEach((enumValue) => {
            if (enumValue.toLowerCase() === userValue.toLowerCase()) {
              options[key] = enumValue;
            }
          });
        } else {
          enums.forEach((enumValue) => {
            if (enumValue === userValue) {
              options[key] = enumValue;
            }
          });
        }
        if (options[key] === undefined) {
          console.warn(
            `The value of ${key} is one of ${enums.join(
              ", "
            )}. Using default value ${defaultValue} instead.`
          );
          options[key] = defaultValue;
        }
      } else if (type === "number") {
        const min = moldObject[key].min ?? -Infinity;
        const max = moldObject[key].max ?? Infinity;
        if (userValue < min || userValue > max) {
          console.warn(
            `The value of ${key} is not within the range of ${min} to ${max}. Using default value ${defaultValue} instead.`
          );
          options[key] = defaultValue;
        } else {
          options[key] = userValue;
        }
      } else if (type === "boolean") {
        options[key] = userValue;
        break;
      } else if (type === "string") {
        const lowercase = moldObject[key].lowercase ?? false;
        if (lowercase) {
          options[key] = userValue.toLowerCase();
        } else {
          options[key] = userValue;
        }
        break;
      } else {
        throw new Error(`Unknown type ${type} for ${key} in moldObject.`);
      }
    }
  }

  return options;
}

export default handleOptions;
