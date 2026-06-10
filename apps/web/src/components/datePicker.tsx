// fallow-ignore-file unused-file
import { format, isValid, parseISO } from 'date-fns'
// Step 1: Import necessary dependencies, such as React, date utilities (e.g., date-fns), and any UI libraries for styling.
import { useEffect, useMemo, useState } from 'react'

import { Calendar } from '@workspace/ui/components/calendar'
import type { Matcher } from 'react-day-picker'

// Step 2: Define TypeScript interfaces for component props, including selected date, onChange callback, and optional configurations like min/max dates.
interface DatePickerProps {
  dateString: string
  onChange: (date: string) => void
  minDate?: string
  maxDate?: string
}

function parseDate(value?: string) {
  if (!value) return undefined
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : undefined
}

// Step 3: Create the main DatePicker component function with proper TypeScript typing.
export function DatePicker({ dateString, onChange, minDate, maxDate }: DatePickerProps) {
  const initialDate = parseDate(dateString)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate)
  const [currentMonth, setCurrentMonth] = useState<Date>(initialDate ?? new Date())

  useEffect(() => {
    const parsed = parseDate(dateString)
    setSelectedDate(parsed)
    if (parsed) {
      setCurrentMonth(parsed)
    }
  }, [dateString])

  const minDateObj = useMemo(() => parseDate(minDate), [minDate])
  const maxDateObj = useMemo(() => parseDate(maxDate), [maxDate])

  const disabled = useMemo<Matcher[] | undefined>(() => {
    const rules: Matcher[] = []
    if (minDateObj) {
      rules.push({ before: minDateObj })
    }
    if (maxDateObj) {
      rules.push({ after: maxDateObj })
    }
    return rules.length > 0 ? rules : undefined
  }, [minDateObj, maxDateObj])

  const handleSelect = (date: Date | undefined) => {
    if (!date || !isValid(date)) return
    setSelectedDate(date)
    onChange(format(date, 'yyyy-MM-dd'))
  }

  return (
    <div className="date-picker">
      <div className="header">
        <span>{format(currentMonth, 'MMMM yyyy')}</span>
      </div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        disabled={disabled}
      />
    </div>
  )
}

// Step 8: Add event handlers for date clicks, month changes, and keyboard navigation for accessibility.

// Step 9: Include optional features like date range selection, time picker integration, or custom formatting.

// Step 10: Export the component and ensure it integrates well with form libraries if needed.
