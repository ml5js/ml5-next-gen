/**
 * Evaluates the value of a moldObject property.
 * If the value is a function, it is called with the filtered options object as the its parameter.
 * Otherwise, the value is returned as is.
 * @param {object} filteredObject - the current filtered options object
 * @param {any} value - the value to evaluate
 * @returns {any} the evaluated value
 */
function evaluate(filteredObject, value) {
  if (typeof value === "function") {
    return value(filteredObject);
  } else {
    return value;
  }
}

/**
 * Checks if a value is within the enumArray.
 * If isCaseInsensitive is true, the comparison is case insensitive.
 *
 * @param {any} value - the value to check
 * @param {Array} enumArray - the array of enum values
 * @param {boolean} isCaseInsensitive - whether the comparison is case insensitive
 * @returns {any | undefined} the enum value if the user value is within the enumArray, otherwise undefined
 */
function checkEnum(value, enumArray, isCaseInsensitive) {
  if (isCaseInsensitive && typeof value === "string") {
    for (const enumValue of enumArray) {
      if (enumValue.toLowerCase() === userValue.toLowerCase()) {
        return enumValue;
      }
    }
  } else {
    for (const enumValue of enumArray) {
      if (enumValue === value) {
        return enumValue;
      }
    }
  }
  return undefined;
}

/**
 * Checks if a value is within the range of min and max.
 * @param {number} value - the value to check
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @returns {any | undefined} the value if it is within the range, otherwise undefined
 */
function checkNumber(value, min, max) {
  if (value < min || value > max) {
    return undefined;
  } else {
    return value;
  }
}

/**
 * This function takes a userObject and a moldObject as parameters.
 * Filters the properties of userObject based on the rules defined in moldObject and returns a filteredObject.
 * Logs out friendly warnings if the properties in userObject did not fulfill the rules.
 *
 * @param {object} userObject - options object provided by the user
 * @param {object} moldObject - an object that defines how the user options object should be filtered
 * @returns {object} - filtered options object
 */
function handleOptions(userObject, moldObject) {
  const filteredObject = {};

  for (const key in moldObject) {
    const userValue = userObject[key];
    const rules = moldObject[key];
    const type = evaluate(filteredObject, rules.type);
    const defaultValue = evaluate(filteredObject, rules.default);

    if (type === "undefined" || type === undefined) {
      continue;
    }
    // If the user did not provide a value for this option, use the default value.
    if (userValue === undefined) {
      filteredObject[key] = defaultValue;
    }
    // If the user provided a value for this option, check if it is of the correct type.
    else if (typeof userValue !== type && type !== "enum") {
      console.warn(
        `The value of ${key} is not of type ${type}. Using default value ${defaultValue} instead.`
      );
      filteredObject[key] = defaultValue;
    }
    // Check specific rules for each type.
    else {
      // If the type is an enum, apply the enum rules
      if (type === "enum") {
        const enums = evaluate(filteredObject, rules.enums);
        const isCaseInsensitive = evaluate(
          filteredObject,
          rules.caseInsensitive
        );
        const checkedValue = checkEnum(userValue, enums, isCaseInsensitive);

        if (checkedValue === undefined) {
          console.warn(
            `The value of ${key} is one of ${enums.join(
              ", "
            )}. Using default value ${defaultValue} instead.`
          );
          filteredObject[key] = defaultValue;
        } else {
          filteredObject[key] = checkedValue;
        }
      }
      // If the type is a number, apply the min and max rules
      else if (type === "number") {
        const min = evaluate(filteredObject, rules.min) ?? -Infinity;
        const max = evaluate(filteredObject, rules.max) ?? Infinity;
        const checkedValue = checkNumber(userValue, min, max);

        if (checkedValue === undefined) {
          console.warn(
            `The value of ${key} is not within the range of ${min} to ${max}. Using default value ${defaultValue} instead.`
          );
          filteredObject[key] = defaultValue;
        } else {
          filteredObject[key] = checkedValue;
        }
      }
      // If type is boolean, string, or object, use the user value as is
      else if (type === "boolean" || type === "string" || type === "object") {
        filteredObject[key] = userValue;
      }
      // Throw an error if the type in moldObject is not "enum", "number", "boolean", "string", or "object"
      else {
        throw new Error(`Unknown type "${type}" for ${key} in moldObject.`);
      }
    }
  }
  console.log(filteredObject);
  return filteredObject;
}

export default handleOptions;
