import client from '~/services/api/client'
import { ResponseDataType } from '~/typing'
import { errorFormatter } from '~/utils/promise-formatter'

export default {
  getAllColors: async (): Promise<ResponseDataType | undefined> => {
    return client
      .post('colors/find')
      .then((res) => {
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  },
  createNewColor: async (nameColor: string, hexColor: string): Promise<ResponseDataType | undefined> => {
    return client
      .post('colors', {
        nameColor: nameColor,
        hexColor: hexColor
      })
      .then((res) => {
        // console.log(JSON.stringify(res.data))
        return res.data
      })
      .catch(function (error) {
        errorFormatter(error)
      })
  }
}
