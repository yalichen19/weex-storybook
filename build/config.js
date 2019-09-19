const config = {
  templateDir: '.temp',
  sourceDir: 'src',
  // Filter for entry files
  // see: https://www.npmjs.com/package/glob#glob-primer
  entryFilter: 'components/*.vue',
  // Options for the filter
  // see: https://www.npmjs.com/package/glob#options
  entryFilterOptions: {},
}
module.exports = config;
