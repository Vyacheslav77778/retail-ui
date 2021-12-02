import { cx } from './theming/Emotion';
import { extractFromObject, hasProp } from './utils';

type ObjectProperty = Record<string, any>;

/**
 * @param obj1 An object containing keys from the second object.
 * @param obj2 An object containing keys from the first object.
 * @returns Returns an array containing only intersecting keys.
 */
function intersection<Object1 extends ObjectProperty, Object2 extends ObjectProperty>(obj1: Object1, obj2: Object2) {
  const keys = Array.from(new Set([...Object.keys(obj1), ...Object.keys(obj2)]));

  return keys.filter((key) => {
    if (hasProp(obj1, key) && hasProp(obj2, key)) {
      return true;
    }
  });
}

/**
 * Merges props using spread operator or function if one is provided.
 *
 * @param mergeFunc A function for merging props. If provided replaces merging using spread operator.
 */
const mergeWith = (
  accumulator: ObjectProperty,
  incoming: ObjectProperty,
  existing: ObjectProperty,
  key: string,
  mergeFunc?: (incoming: ObjectProperty, existing: ObjectProperty) => any,
) => {
  const mergeResult = mergeFunc ? mergeFunc(incoming[key], existing[key]) : { ...incoming[key], ...existing[key] };

  return {
    ...accumulator,
    [key]: mergeResult,
  };
};

/**
 * Recursively merges props from two separate objects into a single object.
 *
 * @param incoming An object containing props that will be merged into the object.
 * @param existing An object into which the props will be merged.
 * @returns Returns an object containing merged props.
 */
export function mergeProps<TIncoming extends ObjectProperty, TExisting extends ObjectProperty>(
  incoming: TIncoming,
  existing: TExisting,
): TIncoming & TExisting {
  const intersectingKeys = intersection(incoming, existing);

  // If there's no intersecting keys
  // we simply merge incoming and existing props.
  if (intersectingKeys.length === 0) {
    return { ...incoming, ...existing };
  }

  // Else we recursively merge props with intersecting keys together.
  const mergedProps = intersectingKeys.reduce<ObjectProperty>((accumulator, key) => {
    if (key === 'className') {
      return mergeWith(accumulator, incoming, existing, key, cx);
    }

    return mergeWith(accumulator, incoming, existing, key);
  }, {});

  const otherProps = extractFromObject({ ...incoming, ...existing }, ([key]) => {
    return !intersectingKeys.includes(key);
  });

  return { ...mergedProps, ...otherProps } as TIncoming & TExisting;
}
