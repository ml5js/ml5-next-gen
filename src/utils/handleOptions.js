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
    } else if (typeof userValue !== type) {
      console.warn(
        `The value of ${key} is not of type ${type}. Using default value ${defaultValue} instead.`
      );
      options[key] = defaultValue;
    } else {
      switch (type) {
        case "string":
          break;
        case "number":
          break;
        case "boolean":
          break;
        case "object":
          break;
        default:
          throw new Error(`Unknown type ${type} for ${key} in moldObject.`);
      }
    }
  }

  return options;
}

export default handleOptions;
