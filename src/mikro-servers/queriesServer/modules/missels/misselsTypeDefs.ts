 export const misselsTypeDefs = `#graphql


   type MaxCountry {
       source: String
       theMostAttacks: Int
   }
   type MaxRoundsCountry {
    source: String
    theMostRounds: Int
}
  type EarliestOrLatestCountry {
    source: String
    attackTime: String
  }

  type AttackedArea {
    area: String
    totalMisslesToArea: String

  }

  type AverageMisselsForArea {
    destination: String
    areaAvgMissels: Float
  }
 `
export const misselsQueryTypeDefs = `#graphql
    getHighestAmountOfMisselsCountry: MaxCountry
    getHighestAmountOfRoundsCountry: MaxRoundsCountry
    getEarliestCountryAttack: EarliestOrLatestCountry
    getLatestCountryAttack: EarliestOrLatestCountry
    getListOfCountries: [String]
    getTheMostAttackedArea: AttackedArea
    getTheLeastAttackedArea: AttackedArea
    getAvgOfMisselsForArea: [AverageMisselsForArea]
  `;

