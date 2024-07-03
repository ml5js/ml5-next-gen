const errorMessages = {
  type: (modelName, keyName, userType, requiredType, defaultValue) =>
    `🟪ml5.js warns: The '${keyName}' option for ${modelName} has to be set to a ${requiredType}, but it is being set to a ${userType} instead.\n\nml5.js is using default value of '${defaultValue}'.`,
  enum: (modelName, keyName, userValue, enums, defaultValue) =>
    `🟪ml5.js warns: The '${keyName}' option for ${modelName} has to be set to ${renderArray(
      enums
    )}, but it is being set to '${userValue}' instead.\n\nml5.js is using default value of '${defaultValue}'.`,
  numberRange: (modelName, keyName, userValue, min, max, defaultValue) =>
    `🟪ml5.js warns: The '${keyName}' option for ${modelName} has to be set to a number between ${min} and ${max}, but it is being set to '${userValue}' instead.\n\nml5.js is using default value of '${defaultValue}'.`,
  numberInteger: (modelName, keyName, userValue, defaultValue) =>
    `🟪ml5.js warns: The '${keyName}' option for ${modelName} has to be set to an integer, but it is being set to the float value '${userValue}' instead.\n\nml5.js is using the default value of '${defaultValue}'.`,
  numberMultipleOf: (modelName, keyName, userValue, multipleOf, defaultValue) =>
    `🟪ml5.js warns: The '${keyName}' option for ${modelName} has to be a multiple of ${multipleOf}, but it is being set to '${userValue}' instead.\n\nml5.js is using the default value of '${defaultValue}'.`,
  modelName: (modelName, userValue, enums, defaultValue) =>
    `🟪ml5.js warns: The modelName parameter for ${modelName} has to be set to ${renderArray(
      enums
    )}, but it is being set to '${userValue}' instead.\n\nml5.js is using default model '${defaultValue}'.`,
};

/**
 * Transforms an array into a human readable string, wrapping the elements with quotation, splitting them with a comma and the last element with "or".
 * @param {array} array
 * @returns {string} the string representation of the array
 */
function renderArray(array) {
  if (array.length === 1) {
    return `'${array[0]}'`;
  } else if (array.length === 2) {
    return `'${array[0]}' or '${array[1]}'`;
  } else {
    const last = array.pop();
    return `'${array.join("', '")}', or '${last}'`;
  }
}

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
 * @param {string | number} value - the value to check
 * @param {Array<string | number>} enumArray - the array of enum values
 * @param {boolean} isCaseInsensitive - whether the comparison is case insensitive
 * @returns {string | number | undefined} the enum value if the user value is within the enumArray, otherwise undefined
 */
function checkEnum(value, enumArray, isCaseInsensitive) {
  if (isCaseInsensitive && typeof value === "string") {
    const matchingValue = enumArray.find(
      (enumValue) => enumValue.toLowerCase() === value.toLowerCase()
    );
    return matchingValue;
  } else {
    const isValid = enumArray.includes(value);
    return isValid ? value : undefined;
  }
}

/**
 * Checks if a value is within the range of min and max.
 * @param {number} value - the value to check
 * @param {number} min - the minimum value
 * @param {number} max - the maximum value
 * @returns {number | undefined} the value if it is within the range, otherwise undefined
 */
function isInRange(value, min, max) {
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
 * @param {string} modelName - the name of the ml5 model
 * @returns {object} - filtered options object
 */
function handleOptions(userObject, moldObject, modelName) {
  const filteredObject = {};

  for (const key in moldObject) {
    const rules = moldObject[key];
    const type = evaluate(filteredObject, rules.type);
    const defaultValue = evaluate(filteredObject, rules.default);
    const ignore = evaluate(filteredObject, rules.ignore);

    if (ignore) {
      continue;
    }

    const aliasKey = moldObject[key].alias;
    let aliasUsed = false;
    let userValue;
    if (userObject[key] !== undefined) {
      userValue = userObject[key];
    } else if (aliasKey !== undefined && userObject[aliasKey] !== undefined) {
      userValue = userObject[aliasKey];
      aliasUsed = true;
    } else {
      // If the user did not provide a value for this option, use the default value.
      filteredObject[key] = defaultValue;
      continue;
    }

    // If the user provided a value for this option, check if it is of the correct type.
    if (typeof userValue !== type && type !== "enum") {
      console.warn(
        errorMessages.type(
          modelName,
          aliasUsed ? aliasKey : key,
          typeof userValue,
          type,
          defaultValue
        )
      );
      filteredObject[key] = defaultValue;
    }
    // Check specific rules for each type.
    else {
      // If the type is an enum, apply the enum rules
      if (type === "enum") {
        const enums = evaluate(filteredObject, rules.enums);
        const isCaseInsensitive =
          evaluate(filteredObject, rules.caseInsensitive) ?? true;
        const checkedValue = checkEnum(userValue, enums, isCaseInsensitive);

        if (checkedValue === undefined) {
          console.warn(
            errorMessages.enum(
              modelName,
              aliasUsed ? aliasKey : key,
              userValue,
              enums,
              defaultValue
            )
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
        const integer = evaluate(filteredObject, rules.integer) ?? false;
        const multipleOf = evaluate(filteredObject, rules.multipleOf);
        const checkedValue = isInRange(userValue, min, max);

        if (integer && !Number.isInteger(userValue)) {
          console.warn(
            errorMessages.numberInteger(
              modelName,
              aliasUsed ? aliasKey : key,
              userValue,
              defaultValue
            )
          );
          filteredObject[key] = defaultValue;
        } else if (multipleOf !== undefined && userValue % multipleOf !== 0) {
          console.warn(
            errorMessages.numberMultipleOf(
              modelName,
              aliasUsed ? aliasKey : key,
              userValue,
              multipleOf,
              defaultValue
            )
          );
          filteredObject[key] = defaultValue;
        } else if (checkedValue === undefined) {
          console.warn(
            errorMessages.numberRange(
              modelName,
              aliasUsed ? aliasKey : key,
              userValue,
              min,
              max,
              defaultValue
            )
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
      // This should never happen if the moldObject is correctly defined.
      else {
        throw new Error(`Unknown type "${type}" for ${key} in moldObject.`);
      }
    }
  }
  return filteredObject;
}

/**
 * A function that takes a user value and checks if it is a valid underlying model name.
 * Returns the model name the user provided if it is valid, otherwise returns the default model name.
 *
 * @param {string} userValue - the value provided by the user
 * @param {string[]} possibleValues - the available model names
 * @param {string} defaultValue  - the default model to use if the userValue is not valid
 * @param {string} ml5ModelName - the name of the ml5 model
 *
 * @returns {string} - the model name to use
 */
function handleModelName(
  userValue,
  possibleValues,
  defaultValue,
  ml5ModelName
) {
  if (userValue === undefined) {
    return defaultValue;
  }

  const modelName = checkEnum(userValue, possibleValues, true);
  if (modelName === undefined) {
    console.warn(
      errorMessages.modelName(
        ml5ModelName,
        userValue,
        possibleValues,
        defaultValue
      )
    );
    return defaultValue;
  }
  return modelName;
}

export { handleModelName };
export default handleOptions;
