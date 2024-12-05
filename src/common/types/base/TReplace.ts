type TReplace<Type, Key extends keyof Type, Replace> = Omit<Type, Key> & {
  [P in Key]: Replace;
};

export default TReplace;
