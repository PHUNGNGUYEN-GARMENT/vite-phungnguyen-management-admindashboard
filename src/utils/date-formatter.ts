import * as dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // import locale
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // import plugin
dayjs().format()

dayjs.extend(isLeapYear) // use plugin
dayjs.locale(undefined, undefined, true) // use locale

// Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
export const DatePattern = {
  display: 'dd-MM-yyyy',
  input: 'YYYY-MM-DDTHH:mm:ss'
}

// export const dateFormatter = (
//   date: Date | string,
//   formatType?: string
// ): string => {
//   const convertToDate = new Date(date)

//   return format(convertToDate, formatType ? formatType : DatePattern.display)
// }

const dateFormatter = (timeStamp: Date | string): string => {
  const dayjsLocal = dayjs
}

export const dateDistance = (date: Date | number): string => {
  return formatDistance(date, Date.now(), { locale: vi })
}
