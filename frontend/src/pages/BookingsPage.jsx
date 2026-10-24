import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star, Calendar, MapPin, CheckCircle } from 'lucide-react';

const BookingsPage = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Rating Modal State
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [ratingForm, setRatingForm] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/api/bookings/guest/${user.email}`);
            setBookings(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenRating = (booking) => {
        setSelectedBooking(booking);
        setRatingForm({ rating: 5, comment: '' });
        setShowRatingModal(true);
    };

    const submitRating = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/reviews', {
                homestayId: selectedBooking.homestayId,
                guestEmail: user.email,
                guestName: user.name,
                rating: ratingForm.rating,
                comment: ratingForm.comment
            });
            setShowRatingModal(false);
            alert("Thank you for your review!");
        } catch (error) {
            console.error(error);
            alert("Failed to submit review.");
        }
    };

    const handleCancelBooking = async (booking) => {
        if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:8080/api/bookings/${booking.id}`);
                alert("Booking cancelled successfully.");
                fetchBookings();
            } catch (error) {
                console.error(error);
                alert(error.response?.data || "Failed to cancel booking.");
            }
        }
    };

    if (loading) return <div className="container" style={{padding: '2rem'}}>Loading bookings...</div>;

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
            <h1 style={{marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Calendar /> Our Bookings
            </h1>

            {bookings.length === 0 ? (
                <div className="card" style={{padding: '3rem', textAlign: 'center'}}>
                    <h2 style={{color: 'var(--gray)', marginBottom: '1rem'}}>No Post Bookings Yet</h2>
                    <p>When you book a homestay, it will appear here.</p>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    {bookings.map(booking => (
                        <div key={booking.id} className="card" style={{padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>
                                <h3 style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>{booking.homestayName}</h3>
                                <p style={{color: 'var(--gray)', margin: 0, marginBottom: '0.25rem'}}>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                {booking.checkInDate && booking.checkOutDate && (
                                    <p style={{color: 'var(--dark)', fontWeight: '500', margin: 0}}>
                                        Stay: {new Date(booking.checkInDate).toLocaleDateString()} to {new Date(booking.checkOutDate).toLocaleDateString()}
                                    </p>
                                )}
                                <div style={{display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--gray)'}}>
                                    <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><CheckCircle size={14} color="var(--secondary)"/> Payment {booking.paymentStatus} ({booking.paymentMethod})</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={() => handleOpenRating(booking)}>
                                    <Star size={18} /> Leave a Review
                                </button>
                                {booking.bookingDate && (new Date() - new Date(booking.bookingDate)) < (24 * 60 * 60 * 1000) && (
                                    <button className="btn btn-danger" onClick={() => handleCancelBooking(booking)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                        Cancel Booking (Within 24h)
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in p-6" style={{padding: '2rem'}}>
                        <h2 style={{marginBottom: '1.5rem'}}>Review {selectedBooking?.homestayName}</h2>
                        <form onSubmit={submitRating}>
                            <div className="input-group">
                                <label className="input-label">Rating (1 to 5)</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <button 
                                            key={num}
                                            type="button" 
                                            style={{
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                padding: '0.5rem'
                                            }}
                                            onClick={() => setRatingForm({...ratingForm, rating: num})}
                                        >
                                            <Star size={32} fill={num <= ratingForm.rating ? "#fbbf24" : "none"} stroke={num <= ratingForm.rating ? "#fbbf24" : "var(--gray)"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Your Comment</label>
                                <textarea 
                                    required 
                                    className="input-field" 
                                    rows="4" 
                                    value={ratingForm.comment} 
                                    onChange={e => setRatingForm({...ratingForm, comment: e.target.value})}
                                    placeholder="How was your stay?"
                                    style={{resize: 'vertical'}}
                                ></textarea>
                            </div>
                            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem'}}>
                                <button type="button" className="btn" onClick={() => setShowRatingModal(false)} style={{border: '1px solid var(--gray)', background: 'transparent'}}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Review</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsPage;
