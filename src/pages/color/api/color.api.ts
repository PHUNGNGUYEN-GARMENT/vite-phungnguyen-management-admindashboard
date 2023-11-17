import client from '~/services/api/client'
import { errorFormatter } from '~/utils/promise-formatter'

export default {
  getAllColors: async () =>
    client
      .post('colors/find')
      .then((res) => {
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      }),
  createNewColor: async (nameColor: string, hexColor: string) => {
    client
      .post('colors', {
        nameColor: nameColor,
        hexColor: hexColor
      })
      .then((res) => {
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  }
}
