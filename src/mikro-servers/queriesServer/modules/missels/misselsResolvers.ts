import { getAvgOfMisselsForArea, getCountryList, getFirstOrLastCountry, getMaxCountry, getMaxRoundsCountry, getTheMostOrTheLeastAttackedArea } from "./redisQueries"

const misselsResolvers = {
  Query:{
    getHighestAmountOfMisselsCountry: async () => {
      const maxCountry= await getMaxCountry()
      return maxCountry
    },
    getHighestAmountOfRoundsCountry: async () => {
      const maxCountry= await getMaxRoundsCountry()
      return maxCountry
    },
    getEarliestCountryAttack : async () => {
      const earliestCountry = await getFirstOrLastCountry('ASC')
      return earliestCountry
    },
    getLatestCountryAttack : async () => {
      const latestCountry = await getFirstOrLastCountry('DESC')
      return latestCountry
    },
    getListOfCountries : async () => {
      const listOfCountries = await getCountryList()
      return listOfCountries
    },
    getTheMostAttackedArea : async () =>  {
      const attackedArea = await getTheMostOrTheLeastAttackedArea('DESC')
      return attackedArea
    },
    getTheLeastAttackedArea : async () =>  {
      const attackedArea = await getTheMostOrTheLeastAttackedArea('ASC')
      return attackedArea
    },
    getAvgOfMisselsForArea : async () => {
      const avgForArea = getAvgOfMisselsForArea()
      return avgForArea
    }
  }
}


export default misselsResolvers