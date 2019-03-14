// This is just an example of how one could separate out some logic
// of consistent wrapping of functions with rollbar to add context.
// The first argument here is an instance of Rollbar and the last
// argument is a function so it allows for a trailing closure syntax
// that is a little easier to work with.

export function wrap(r, name, f) {
  return r.wrap(f, {appName: name});
}
