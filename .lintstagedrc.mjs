export default {
  '**/*.{cjs,js,json,mjs,ts,tsx}': (filenames) => [`prettier --write ${filenames.join(' ')}`],
};
