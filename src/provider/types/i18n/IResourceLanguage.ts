interface IResourceLanguage {
  ariaLabels: Record<string, string>;
  buttons: Record<string, string>;
  captions: Record<string, string>;
  errors: {
    descriptions: Record<string, string>;
    inputs: Record<string, string>;
    titles: Record<string, string>;
  };
  headings: Record<string, string>;
  labels: Record<string, string>;
  placeholders: Record<string, string>;
  titles: Record<string, string>;
  values: Record<string, string>;
}

export default IResourceLanguage;
