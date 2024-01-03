import { misselsQueryTypeDefs } from '../modules/missels/misselsTypeDefs';
  const typeDefs = `#graphql   
    type Query{
      ${misselsQueryTypeDefs}
    } 
     `;
  
  export default typeDefs;