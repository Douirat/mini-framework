
export function applyEventHandlers(element, props) {
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on') && typeof value === 'function') {
      element[key.toLowerCase()] = value;
    }
  }
}
