import DayJS from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import plugin from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

DayJS.extend(relativeTime)
DayJS.extend(plugin)
DayJS.extend(customParseFormat)
DayJS.extend
// Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
export enum DatePattern {
  display = 'DD-MM-YYYY',
  input = 'YYYY-MM-DDTHH:mm:ss'
}

export type DateType = 'display' | 'iso8601'

export const dateFormatter = (
  timeStamp: Date | string,
  formatType: DateType = 'display'
): string => {
  const dayjsLocal = DayJS(timeStamp)
  switch (formatType) {
    case 'display':
      return dayjsLocal.format('MM-DD-YYYY')
    default:
      return dayjsLocal.toISOString()
  }
}

export default DayJS
