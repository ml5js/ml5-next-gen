/**
 * Evaluates the value of a moldObject property.
 * If the value is a function, it is called with the thisArg as its context.
 * Otherwise, the value is returned as is.
 * @param {object} thisArg
 * @param {any} value
 * @returns {any} - evaluated value
 * @private
 */
function evaluate(thisArg, value) {
  if (typeof value === "function") {
    return value.call(thisArg);
  } else {
    return value;
  }
}

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
    const type = evaluate(options, moldObject[key].type);
    const defaultValue = evaluate(options, moldObject[key].default);
    // If the user did not provide a value for this option, use the default value.
    if (userValue === undefined) {
      options[key] = defaultValue;
    }
    // If the user provided a value for this option, check if it is of the correct type.
    else if (typeof userValue !== type && type !== "enum") {
      console.warn(
        `The value of ${key} is not of type ${type}. Using default value ${defaultValue} instead.`
      );
      options[key] = defaultValue;
    }
    // Check specific rules for each type.
    else {
      // If the type is an enum
      if (type === "enum") {
        const enums = evaluate(options, moldObject[key].enums);
        const caseInsensitive =
          evaluate(options, moldObject[key].caseInsensitive) ?? true;
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
      }
      // If the type is a number
      else if (type === "number") {
        const min = evaluate(options, moldObject[key].min) ?? -Infinity;
        const max = evaluate(options, moldObject[key].max) ?? Infinity;
        if (userValue < min || userValue > max) {
          console.warn(
            `The value of ${key} is not within the range of ${min} to ${max}. Using default value ${defaultValue} instead.`
          );
          options[key] = defaultValue;
        } else {
          options[key] = userValue;
        }
      }
      // If the type is a boolean
      else if (type === "boolean") {
        options[key] = userValue;
      }
      // If the type is a string
      else if (type === "string") {
        const lowercase = evaluate(options, moldObject[key].lowercase) ?? false;
        if (lowercase) {
          options[key] = userValue.toLowerCase();
        } else {
          options[key] = userValue;
        }
      }
      // If the type is an object
      else if (type === "object") {
        options[key] = userValue;
      }
      // Throw an error if the type in moldObject is not recognized
      else {
        throw new Error(`Unknown type "${type}" for ${key} in moldObject.`);
      }
    }
  }
  return options;
}

export default handleOptions;
