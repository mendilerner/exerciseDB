import { misselsQueryTypeDefs, misselsTypeDefs } from '../modules/missels/misselsTypeDefs';
const typeDefs = `#graphql 
    ${misselsTypeDefs}  
    type Query{
      ${misselsQueryTypeDefs}
    } 
     `;

export default typeDefs;