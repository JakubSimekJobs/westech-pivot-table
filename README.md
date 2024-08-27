# westech-pivot-table

Solution for [code assignment](src/assets/zadanie_js%201.txt).

## Tech used:

- javascript: [Vue 3](https://vuejs.org/) - as Westech default framework was used together wyth [Typescript](https://www.typescriptlang.org/) for extra type safety
- styles: Native Css variables + Scss + BEM methodology 
  - [Css variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties#declaring_custom_properties): styles utilize native css variables, for most part a vue default styles were kept in place with few sensible custom variables added.
  - [BEM methodology](https://getbem.com/): User to keep styles organized
  - [SASS](https://sass-lang.com/): Preprocessor is used for [media query variables](src/assets/styles/variables.scss) as these cannot be defined in native css yet
- Icons: [Icomoon](https://icomoon.io/) - to create custom icon pack to abstract svg logic for ease of use directly in templates

## Table Logic
1. Data Fetching: All endpoints (in this case one endpoint) are defined in [/api](src/api/) folder. All endpoints utilize custom composable [useApi](src/composables/useApi.ts) to for unified use of fetch
2. Map data to table structure: Fetched Data are mapped to table format using `initTable()`.
3. Display data in pivot table

## Table data structure:

```json
{
  "head": [["BA","BB","KE","LM","MI","NR","PE","PP","TN","TT","ZA"]], // valid col names
  "rows": [
    {
      "name": "Xbox",
      "cols": {
        "BA": 1450,
        "BB": 1327
        //  ...another cols
      },
      "detail": [
        {
          "name": "Xbox Series X with EA FC 24",
          "cols": {
            "BA": 302,
            "BB": 236,
            "KE": 282
            //  ...another cols
          }
        }
        //  ...another details
      ],
      "open": false
    }
    //  ...another categories
  ]
}
```

## Possible questions:
- **Computation complexity:**
  - `O()` of data reducer
    - Data agregation in reducer is done by simple for loop which has complexity of `O(n)`.
    - Once products are aggregated in categories they are sorted which is done in nested for loop with complexity of `O(nlogn)` which is done on much smaller number of objects. This part is not required but it ease the work with data later in table.
    - Also we are creating a head object to ease the work with column names later. this is done by adding column into set which is of `O(1)` 
  - `O()` of table rendering
    - Table head is rendered in v-for directive with `O(n)`, where `n` is number of columns.
    - Main data rows are rendered in nested v-for directive with `O(n*m)`, where `m` is number of rows.
    - Detailed data rows are rendered in nested v-for directive which should be of `O(n*m*o)` where `o` is the average number of detail rows, initial state is with closed details so this complexity is not taken into account on page load
  - `O()` of sorting - 
    - sorting of main rows is done with native array sort which is `O(nlogn)` and sorting of details is nested in for loop so `O(n×mlogm)`, where `n` is number of main rows and `m` is average number of details.
    - theoretically we can save some performance if we sort only opened details. This will however make the code logic overall more complex and harder to maintain as we should should sort the given row details on open.
- **Is table responsive?**: table is fully responsive on mobile, where it is horizontally scrollable.
- **Why is .env public?**: Guilty as charged! I wanted to keep the code ready for review. Will not happen in production 😊

## Project Setup

```sh
npm install
npm run dev
```
