import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { apiRequest, ApiBooking, mapBooking } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Calendar, Clock, MapPin, Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';

const MasterSchedule: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<ApiBooking[]>('/api/admin/bookings', { auth: true });
            setBookings(data.map(mapBooking));
        } catch (err) {
            console.error('Failed to fetch schedule:', err);
            setError(getErrorMessage(err, 'Failed to load schedule.'));
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const filteredBookings = bookings.filter(b =>
        b.eventName.toLowerCase().includes(search.toLowerCase()) ||
        b.clubName.toLowerCase().includes(search.toLowerCase()) ||
        b.venueName.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusVariant = (status: string): "success" | "destructive" | "pending" | "default" => {
        switch (status) {
            case 'approved': return 'success'; // mapped to success variant
            case 'rejected': return 'destructive';
            case 'pending': return 'pending';
            default: return 'default';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Master Schedule</h1>
                    <p className="text-textMuted text-sm sm:text-base mt-1">View all venue bookings across the campus.</p>
                </div>
                <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-textMuted pointer-events-none" />
                    <Input
                        placeholder="Search events..."
                        className="pl-10 rounded-xl w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="rounded-xl mb-6">
                    <AlertTriangle size={16} />
                    <AlertTitle>Could not load schedule</AlertTitle>
                    <AlertDescription className="mt-1">{error}</AlertDescription>
                    <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={fetchBookings}>
                        <RefreshCw size={14} />
                        Retry
                    </Button>
                </Alert>
            )}
            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-28 sm:h-24 w-full rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredBookings.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12 sm:py-16 text-textMuted bg-hoverSoft rounded-xl border-2 border-dashed border-borderSoft"
                        >
                            <p className="font-medium">No bookings found matching your search.</p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-4">
                        {filteredBookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <Card className="rounded-2xl rounded-xl overflow-hidden hover:border-brand/30 transition-colors">
                                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="font-semibold text-lg">{booking.eventName}</div>
                                                <Badge variant={getStatusVariant(booking.status)}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-textMuted">
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    <span>{booking.venueName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} />
                                                    <span>{booking.startTime} - {booking.endTime}</span>
                                                </div>
                                            </div>

                                            <div className="mt-2 text-xs font-medium text-primary">
                                                Organized by {booking.clubName}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default MasterSchedule;
