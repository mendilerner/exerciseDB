import misselsResolvers from '../modules/missels/misselsResolvers';
const resolvers = {
  Query: {
    ...misselsResolvers.Query
  }
};

export default resolvers;