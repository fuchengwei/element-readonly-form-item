import { formatDate, parseDate, getWeekNumber } from 'element-ui/src/utils/date-util'

export const DEFAULT_FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  months: 'yyyy-MM',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  time: 'HH:mm:ss',
  week: 'yyyywWW',
  timerange: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss',
  year: 'yyyy',
  years: 'yyyy'
}

const DATE_FORMATTER = (value, format) => {
  if (format === 'timestamp') {
    return value.getTime()
  }
  return formatDate(value, format)
}

const DATE_PARSER = (text, format) => {
  if (format === 'timestamp') {
    return new Date(Number(text))
  }
  return parseDate(text, format)
}

const RANGE_FORMATTER = (value, format) => {
  if (Array.isArray(value) && value.length === 2) {
    const start = value[0]
    const end = value[1]

    if (start && end) {
      return [DATE_FORMATTER(start, format), DATE_FORMATTER(end, format)]
    }
  }
  return ''
}

const RANGE_PARSER = (array, format, separator) => {
  if (!Array.isArray(array)) {
    array = array.split(separator)
  }
  if (array.length === 2) {
    const range1 = array[0]
    const range2 = array[1]

    return [DATE_PARSER(range1, format), DATE_PARSER(range2, format)]
  }
  return []
}

const TYPE_VALUE_RESOLVER_MAP = {
  default: {
    formatter(value) {
      if (!value) {
        return ''
      }
      return '' + value
    },
    parser(text) {
      if (text === undefined || text === '') {
        return null
      }
      return text
    }
  },
  week: {
    formatter(value, format) {
      const week = getWeekNumber(value)
      const month = value.getMonth()
      const trueDate = new Date(value)
      if (week === 1 && month === 11) {
        trueDate.setHours(0, 0, 0, 0)
        trueDate.setDate(trueDate.getDate() + 3 - ((trueDate.getDay() + 6) % 7))
      }
      let date = formatDate(trueDate, format)

      date = /WW/.test(date) ? date.replace(/WW/, week < 10 ? '0' + week : week) : date.replace(/W/, week)
      return date
    },
    parser(text, format) {
      // parse as if a normal date
      return TYPE_VALUE_RESOLVER_MAP.date.parser(text, format)
    }
  },
  date: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  datetime: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  daterange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  monthrange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  datetimerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  timerange: {
    formatter: RANGE_FORMATTER,
    parser: RANGE_PARSER
  },
  time: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  month: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  year: {
    formatter: DATE_FORMATTER,
    parser: DATE_PARSER
  },
  number: {
    formatter(value) {
      if (!value) return ''
      return '' + value
    },
    parser(text) {
      const result = Number(text)

      if (!isNaN(text)) {
        return result
      } else {
        return null
      }
    }
  },
  dates: {
    formatter(value, format) {
      return value.map((date) => DATE_FORMATTER(date, format))
    },
    parser(value, format) {
      return (typeof value === 'string' ? value.split(', ') : value).map((date) => (date instanceof Date ? date : DATE_PARSER(date, format)))
    }
  },
  months: {
    formatter(value, format) {
      return value.map((date) => DATE_FORMATTER(date, format))
    },
    parser(value, format) {
      return (typeof value === 'string' ? value.split(', ') : value).map((date) => (date instanceof Date ? date : DATE_PARSER(date, format)))
    }
  },
  years: {
    formatter(value, format) {
      return value.map((date) => DATE_FORMATTER(date, format))
    },
    parser(value, format) {
      return (typeof value === 'string' ? value.split(', ') : value).map((date) => (date instanceof Date ? date : DATE_PARSER(date, format)))
    }
  }
}

export const parseAsFormatAndType = (value, customFormat, type, rangeSeparator = '-') => {
  if (!value) {
    return null
  }
  const parser = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP.default).parser
  const format = customFormat || DEFAULT_FORMATS[type]
  return parser(value, format, rangeSeparator)
}

export const formatAsFormatAndType = (value, customFormat, type) => {
  if (!value) {
    return null
  }
  const formatter = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP.default).formatter
  const format = customFormat || DEFAULT_FORMATS[type]
  return formatter(value, format)
}

/*
 * Considers:
 *   1. Date object
 *   2. date string
 *   3. array of 1 or 2
 */
export const valueEquals = (a, b) => {
  // considers Date object and string
  const dateEquals = (a, b) => {
    const aIsDate = a instanceof Date
    const bIsDate = b instanceof Date
    if (aIsDate && bIsDate) {
      return a.getTime() === b.getTime()
    }
    if (!aIsDate && !bIsDate) {
      return a === b
    }
    return false
  }

  const aIsArray = a instanceof Array
  const bIsArray = b instanceof Array
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) {
      return false
    }
    return a.every((item, index) => dateEquals(item, b[index]))
  }
  if (!aIsArray && !bIsArray) {
    return dateEquals(a, b)
  }
  return false
}

export const isString = (val) => {
  return typeof val === 'string' || val instanceof String
}

export const validator = (val) => val === null || val === undefined || isString(val) || (Array.isArray(val) && val.length === 2 && val.every(isString))
