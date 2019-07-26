# Components

The components directory contains your Vue.js Components.

## Auto importing

All the components in this directory will be automatically defined to global components. The components will be append a prefix `app-`.

The importing code is locating in `~/plugins/components.js`

## Name Casing

Refer to <https://vuejs.org/v2/guide/components-registration.html#Name-Casing>

The `PascalCase` components names will be converted to `kebab-case` in templates section.

Example:

```text
// Component's filename
CategoryIcon.vue
```

```pug
// Component references in another components
div
  app-brand-icon(brand='github')
```
