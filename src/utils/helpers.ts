import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import DayJS, { DatePattern } from './date-formatter'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const numberValidatorDisplay = (number?: number | null): number => {
  return number ? number : 0
}

export const textValidatorDisplay = (text?: string | null): string => {
  return text ? text : ''
}

export const dateValidatorDisplay = (date?: string | null): string => {
  return date ? DayJS(date).format(DatePattern.display) : ''
}
