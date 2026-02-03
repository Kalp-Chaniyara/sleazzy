import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Upload, FileText, AlertTriangle, RefreshCw } from 'lucide-react';
import { apiRequest, mapBooking, type ApiBooking, type ApiVenue } from '../lib/api';
import { toastInfo, toastError } from '../lib/toast';
import { getErrorMessage } from '../lib/errors';
import { Booking } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Skeleton } from '../components/ui/skeleton';
import { cn } from '@/lib/utils';

const MyBookings: React.FC = () => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [venuesData, bookingsData] = await Promise.all([
        apiRequest<ApiVenue[]>('/api/venues'),
        apiRequest<ApiBooking[]>('/api/my-bookings', { auth: true }),
      ]);
      setVenues(venuesData);
      setMyBookings(bookingsData.map(mapBooking));
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(getErrorMessage(err, 'Failed to load bookings.'));
      setMyBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getVenueName = (id: string) => venues.find(v => v.id === id)?.name || id;

  const groupedBookings = React.useMemo(() => {
    const groups: Record<string, Booking & { venueNames: string[] }> = {};

    myBookings.forEach(booking => {
      // Group by batchId if available, otherwise by event details
      const key = booking.batchId || `${booking.eventName}-${booking.date}-${booking.startTime}-${booking.endTime}`;

      const vName = getVenueName(booking.venueId);

      if (!groups[key]) {
        groups[key] = {
          ...booking,
          venueNames: [vName]
        };
      } else {
        if (!groups[key].venueNames.includes(vName)) {
          groups[key].venueNames.push(vName);
        }
      }
    });

    return Object.values(groups);
  }, [myBookings, venues]);

  const isPastEvent = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    return eventDate < today;
  };

  const handleFileUpload = async (id: string, type: 'report' | 'indent') => {
    // TODO: Replace with actual file upload API call
    try {
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('bookingId', id);
      // formData.append('type', type);
      // await fetch('/api/bookings/upload', { method: 'POST', body: formData });
      toastInfo(`File upload for ${type === 'report' ? 'event report' : 'indent'} will be available soon.`);
    } catch (error) {
      console.error('Failed to upload file:', error);
      toastError(error, 'Failed to upload file.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-textPrimary tracking-tight">My Bookings</h2>
          <p className="text-textMuted mt-2 text-sm sm:text-base font-medium">Manage current reservations and submit post-event reports.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertTriangle size={16} />
          <AlertTitle>Could not load bookings</AlertTitle>
          <AlertDescription className="mt-1">{error}</AlertDescription>
          <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={fetchBookings}>
            <RefreshCw size={14} />
            Retry
          </Button>
        </Alert>
      )}
      {isLoading ? (
        <div className="grid gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-borderSoft rounded-xl p-4 sm:p-6">
              <Skeleton className="h-24 w-full" />
            </Card>
          ))}
        </div>
      ) : !error && myBookings.length === 0 ? (
        <Card className="border border-borderSoft rounded-xl p-12 text-center">
          <p className="text-textMuted">No bookings found.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {groupedBookings.map((booking, index) => {
            const isPast = isPastEvent(booking.date);

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "border border-borderSoft rounded-xl flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6 hover:border-brand/30 transition-all rounded-2xl shadow-lg shadow-black/5",
                    isPast ? '' : ''
                  )}
                >
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6 w-full">
                    {/* Date Box */}
                    <div className={cn(
                      "w-full md:w-24 h-24 rounded-2xl flex flex-col items-center justify-center shrink-0 border",
                      isPast
                        ? 'bg-hoverSoft border-borderSoft text-textMuted'
                        : 'bg-brand/10 border-brand/20 text-brand'
                    )}>
                      <span className="text-xs font-bold uppercase">
                        {new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-bold leading-none">
                        {new Date(booking.date).getDate()}
                      </span>
                      <span className="text-xs mt-1">{new Date(booking.date).getFullYear()}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h3 className={cn(
                            "text-lg sm:text-xl font-bold",
                            isPast ? 'text-textMuted' : 'text-textPrimary'
                          )}>
                            {booking.eventName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-sm text-textMuted">
                            <span className="flex items-center gap-1.5">
                              <Clock size={16} />
                              {booking.startTime} - {booking.endTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={16} />
                              {booking.venueNames.join(', ')}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant={
                            booking.status === 'approved'
                              ? isPast ? 'secondary' : 'success'
                              : 'pending'
                          }
                        >
                          {isPast ? 'Completed' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>

                      {/* Post Event Actions */}
                      {isPast && booking.status === 'approved' && (
                        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileUpload(booking.id, 'report')}
                            className="flex items-center gap-2"
                          >
                            <Upload size={16} />
                            Upload Event Report
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFileUpload(booking.id, 'indent')}
                            className="flex items-center gap-2"
                          >
                            <FileText size={16} />
                            Upload Indent
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default MyBookings;
