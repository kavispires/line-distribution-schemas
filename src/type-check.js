import { Enum } from './enum';

/**
 * Verifies type of given properties
 * @param {class} context the class of given type (artist, unit, etc)
 * @param {object} types object referencing the properties and types following the schema:
 * {<property_name>: '<property_type>:<property_options>' }
 * Property options can be:
 * - optional
 * - an enum type
 */
export function typeCheck(context, types) {
  let errorMessage = null;

  const entries = Object.entries(types);

  for (let i = 0; i < entries.length; i++) {
    if (errorMessage) {
      break;
    }

    const [property, typeValue] = entries[i];
    const [type, extra] = typeValue.split(':');
    const currentValue = context[property];

    // If no extra information, the property is required, check existence
    if (!extra && !exists(currentValue)) {
      const propertyName = property.startsWith('_') ? property.substring(1) : property;
      errorMessage = `Missing required property '${propertyName}'`;
      break;
    }

    // Only check properties that are present
    if (exists(currentValue)) {
      switch (type) {
        case 'Enum':
          Enum.validate(extra, currentValue);
          break;
        case 'Date':
          errorMessage = validateDate(currentValue, property);
          break;
        case 'Year':
          errorMessage = validateYear(currentValue, property);
          break;
        case 'array':
          errorMessage = validateArray(currentValue, property);
          break;
        default:
          if (typeof currentValue !== type) {
            errorMessage = `Expected ${property} to be a ${type}, instead got ${typeof currentValue}`;
          }
      }
    }
  }

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return true;
}

// Type Checking Utils

/**
 * Checks if value is not a nullish type
 * @param {*} value
 */
function exists(value) {
  return value !== undefined && value !== null;
}

/**
 * Check if value is a Date
 * @param {string} value
 * @param {string} property
 */
function validateDate(value, property) {
  if (!value || typeof value !== 'number') {
    return `Expected ${property} to be a date number format YYYYMMDD, instead got ${typeof value}`;
  }
  if (value < 10000000) {
    return `Expected ${property} to be a date number format YYYYMMDD, instead got ${value}`;
  }
  const valueStr = value.toString();
  const year = +valueStr.substring(0, 4);
  const month = +valueStr.substring(4, 6);
  const day = +valueStr.substring(6);
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
    return `Expected ${property} to be a date with format YYYYMMDD, instead got ${value}`;
  }

  return null;
}

/**
 * Check if value is an Array
 * @param {string} value
 * @param {string} property
 */
function validateArray(value, property) {
  if (!Array.isArray(value)) {
    return `Expected ${property} to be an array, instead got ${typeof value}`;
  }

  return null;
}

/**
 * Check if value is a Year
 * @param {string} value
 * @param {string} property
 */
function validateYear(value, property) {
  if (!value || typeof value !== 'number') {
    return `Expected ${property} to be a year number format YYYY, instead got ${typeof value}`;
  }
  if (value < 1000 || value > 9999) {
    return `Expected ${property} to be a year number format YYYY, instead got ${value}`;
  }

  return null;
}
