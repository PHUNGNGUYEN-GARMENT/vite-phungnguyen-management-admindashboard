import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'

// Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
export const DatePattern = {
  display: 'dd-MM-yyyy',
  input: 'YYYY-MM-DDTHH:mm:ss'
}

export const dateFormatter = (
  date: Date | string,
  formatType?: string
): string => {
  const convertToDate = new Date(date)

  return format(convertToDate, formatType ? formatType : DatePattern.display)
}

export const dateDistance = (date: Date | number): string => {
  return formatDistance(date, Date.now(), { locale: vi })
}
