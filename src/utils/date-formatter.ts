import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'

// Set the output to "1.9.2018 18:01:36.386 GMT+02:00 (CEST)"
const pattern = 'd.M.yyyy HH:mm:ss.SSS'

export const dateFormatter = (date: Date | string): string => {
  const convertToDate = new Date(date)

  return format(convertToDate, pattern)
}

export const dateDistance = (date: Date | string): string => {
  const convertToDate = new Date(date)

  return formatDistance(convertToDate, Date.now(), { locale: vi })
}
