import DayJS from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import plugin from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

DayJS.extend(relativeTime)
DayJS.extend(plugin)
DayJS.extend(customParseFormat)
// Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"

export const DatePattern = {
  display: 'DD/MM/YYYY',
  dateTimeDisplay: 'L - LT',
  iso8601: 'YYYY-MM-DDTHH:mm:ss.sssZ'
}

export type DateType = 'display' | 'iso8601'

export const dateFormatter = (timeStamp: Date | string, formatType?: DateType): string => {
  const dayjsLocal = DayJS(timeStamp)
  if (formatType) {
    switch (formatType) {
      case 'display':
        return dayjsLocal.format('MM/DD/YYYY')
      default:
        return dayjsLocal.toISOString()
    }
  }
  return dayjsLocal.format('MM/DD/YYYY')
}

export default DayJS
