'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react'

interface BookingSlot {
  date: string
  bookings: Array<{
    id: string
    travelerName: string
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
    time?: string
  }>
  available: boolean
  capacity: number
  booked: number
}

interface BookingCalendarProps {
  businessId: string
  listingId?: string
  onDateSelect?: (date: string) => void
  selectedDate?: string
  readOnly?: boolean
}

export function BookingCalendar({
  businessId,
  listingId,
  onDateSelect,
  selectedDate,
  readOnly = false
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState<BookingSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(selectedDate || null)

  useEffect(() => {
    fetchBookings()
  }, [businessId, listingId, currentMonth])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        businessId,
        ...(listingId && { listingId }),
        month: currentMonth.getMonth().toString(),
        year: currentMonth.getFullYear().toString(),
      })

      const response = await fetch(`/api/bookings/calendar?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelect = (date: string) => {
    if (readOnly) return
    
    const slot = bookings.find(b => b.date === date)
    if (slot && slot.available && slot.booked < slot.capacity) {
      setSelected(date)
      onDateSelect?.(date)
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    return new Date(year, month, day).toISOString().split('T')[0]
  }

  const getSlotForDate = (day: number) => {
    if (day === null) return null
    const dateString = getDateString(day)
    return bookings.find(b => b.date === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const today = new Date()
  const isToday = (day: number) => {
    if (day === null) return false
    const dateString = getDateString(day)
    const todayString = today.toISOString().split('T')[0]
    return dateString === todayString
  }

  const isPast = (day: number) => {
    if (day === null) return false
    const dateString = getDateString(day)
    const todayString = today.toISOString().split('T')[0]
    return dateString < todayString
  }

  const days = getDaysInMonth()
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <Card className="bg-gray-800 border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Booking Calendar</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white font-semibold min-w-[180px] text-center">
            {monthName}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading calendar...</p>
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const slot = getSlotForDate(day)
              const dateString = getDateString(day)
              const isSelected = selected === dateString
              const dayIsPast = isPast(day)
              const dayIsToday = isToday(day)

              // Determine availability
              const isAvailable = slot
                ? slot.available && slot.booked < slot.capacity && !dayIsPast
                : !dayIsPast

              const isFull = slot ? slot.booked >= slot.capacity : false

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(dateString)}
                  disabled={readOnly || !isAvailable || dayIsPast}
                  className={`
                    aspect-square rounded-lg border-2 transition-all
                    ${isSelected
                      ? 'border-yellow-500 bg-yellow-500/20'
                      : isToday(day)
                      ? 'border-yellow-400/50 bg-yellow-400/10'
                      : 'border-gray-600 bg-gray-700/50'
                    }
                    ${!isAvailable || dayIsPast
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-yellow-500 hover:bg-yellow-500/10 cursor-pointer'
                    }
                    ${readOnly ? 'cursor-default' : ''}
                  `}
                >
                  <div className="flex flex-col items-center justify-center h-full p-1">
                    <span className={`text-sm font-semibold ${
                      isSelected ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {day}
                    </span>
                    {slot && (
                      <div className="flex items-center gap-1 mt-1">
                        {slot.booked > 0 && (
                          <span className="text-xs text-gray-400">
                            {slot.booked}/{slot.capacity}
                          </span>
                        )}
                        {isFull ? (
                          <XCircle className="w-3 h-3 text-red-400" />
                        ) : isAvailable ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-400/50 bg-yellow-400/10 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-500/20 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Full</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-600 bg-gray-700/50 rounded opacity-50"></div>
              <span>Past/Unavailable</span>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}

