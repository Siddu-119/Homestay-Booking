import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Star, Wifi, Wind, Check, X, QrCode } from 'lucide-react';

const HomestayDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [homestay, setHomestay] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Booking Modal State
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [bookingForm, setBookingForm] = useState({
        guestName: user?.name || '',
        guestPhone: '',
        checkInDate: '',
        checkOutDate: '',
        paymentMethod: 'ONLINE', // ONLINE or CASH
        utrNumber: ''
    });

    useEffect(() => {
        fetchHomestayDetails();
    }, [id]);

    const fetchHomestayDetails = async () => {
        setLoading(true);
        try {
            const hsRes = await axios.get(`http://localhost:8080/api/homestays/${id}`);
            setHomestay(hsRes.data);
            
            const reqRes = await axios.get(`http://localhost:8080/api/reviews/homestay/${id}`);
            setReviews(reqRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookRoom = (room) => {
        if (!user || user.role !== 'GUEST') {
            alert("Please login as a Guest to book a room");
            return;
        }
        setSelectedRoom(room);
        setShowBookingModal(true);
    };

    const calculateTotalAmount = () => {
        if (!selectedRoom) return 0;
        if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return selectedRoom.price;
        const start = new Date(bookingForm.checkInDate);
        const end = new Date(bookingForm.checkOutDate);
        const diffTime = end.getTime() - start.getTime();
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) diffDays = 1;
        return selectedRoom.price * diffDays;
    };

    const confirmBooking = async (e) => {
        e.preventDefault();
        
        if (new Date(bookingForm.checkInDate) >= new Date(bookingForm.checkOutDate)) {
            alert("Check-out date must be after check-in date.");
            return;
        }

        if (bookingForm.paymentMethod === 'ONLINE') {
            if (!bookingForm.utrNumber || bookingForm.utrNumber.trim().length !== 12) {
                alert("Please complete the UPI payment and enter the valid 12-digit UTR/Reference number to verify your booking.");
                return;
            }
        }

        try {
            await axios.post('http://localhost:8080/api/bookings', {
                homestayId: homestay.id,
                homestayName: homestay.name,
                roomId: selectedRoom.id,
                guestEmail: user.email,
                guestName: bookingForm.guestName,
                guestPhone: bookingForm.guestPhone,
                checkInDate: bookingForm.checkInDate,
                checkOutDate: bookingForm.checkOutDate,
                paymentMethod: bookingForm.paymentMethod
            });
            setShowBookingModal(false);
            alert("Booking Confirmed! View it in 'Our Bookings'");
            navigate('/bookings');
        } catch (error) {
            console.error(error);
            alert("Failed to book room");
        }
    };

    if (loading) return <div className="container" style={{padding: '2rem'}}>Loading details...</div>;
    if (!homestay) return <div className="container" style={{padding: '2rem'}}>Homestay not found.</div>;

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
            <div className="card animate-fade-in" style={{marginBottom: '3rem', overflow: 'hidden'}}>
                <img src={homestay.photoUrl} alt={homestay.name} style={{width: '100%', height: '400px', objectFit: 'cover'}} />
                <div style={{padding: '2rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                        <h1 style={{fontSize: '2.5rem', margin: 0}}>{homestay.name}</h1>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', color: '#fbbf24', fontWeight: 'bold'}}>
                            <Star fill="#fbbf24" /> {homestay.averageRating > 0 ? homestay.averageRating.toFixed(1) : 'New'}
                        </div>
                    </div>
                    {homestay.address && <p style={{fontSize: '1.2rem', color: 'var(--gray)', marginBottom: '1rem'}}>{homestay.address}</p>}
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(homestay.locationMapUrl)}`} target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', color: 'var(--gray)', textDecoration: 'none', marginBottom: '1.5rem'}}>
                        <MapPin /> {homestay.locationMapUrl}
                    </a>
                    <a href={`https://www.google.com/maps/search/tourist+attractions+near+${encodeURIComponent(homestay.locationMapUrl)}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none'}}>
                        <MapPin size={18} /> View Nearby Tourist Attractions
                    </a>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem'}}>
                <div>
                    <h2 style={{marginBottom: '1.5rem'}}>Available Rooms</h2>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        {homestay.rooms.length === 0 && <p>No rooms currently available.</p>}
                        {homestay.rooms.map((room, idx) => (
                            <div key={room.id} className="card" style={{display: 'flex', overflow: 'hidden'}}>
                                <img src={room.photoUrl} alt="Room" style={{width: '200px', objectFit: 'cover'}} />
                                <div style={{padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column'}}>
                                    <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem'}}>Room {idx + 1} ({room.numberOfBeds} Beds)</h3>
                                    
                                    <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem', color: 'var(--gray)'}}>
                                        {room.isAc && <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Wind size={16}/> AC</span>}
                                        {room.hasWifi && <span style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}><Wifi size={16}/> Wi-Fi</span>}
                                    </div>
                                    <p style={{fontSize: '0.9rem', marginBottom: '1rem'}}>{room.otherFeatures}</p>
                                    
                                    <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)'}}>₹{room.price}<span style={{fontSize: '1rem', color: 'var(--gray)'}}>/night</span></span>
                                        <button className="btn btn-primary" onClick={() => handleBookRoom(room)}>Book This Room</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 style={{marginBottom: '1.5rem'}}>Guest Reviews</h2>
                    <div className="card" style={{padding: '1.5rem'}}>
                        {reviews.length === 0 ? (
                            <p style={{color: 'var(--gray)'}}>No reviews yet.</p>
                        ) : (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                                {reviews.map(review => (
                                    <div key={review.id} style={{borderBottom: '1px solid var(--gray-light)', paddingBottom: '1rem'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                            <strong>{review.guestName}</strong>
                                            <div style={{display: 'flex', color: '#fbbf24'}}><Star size={14} fill="#fbbf24"/> {review.rating}</div>
                                        </div>
                                        <p style={{fontSize: '0.9rem', margin: 0}}>{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay">
                    <div className="modal-content animate-fade-in p-6" style={{padding: '2rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                            <h2>Book Room in {homestay.name}</h2>
                            <button onClick={() => setShowBookingModal(false)} style={{background: 'none', border: 'none', cursor: 'pointer'}}><X size={24} /></button>
                        </div>
                        <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--light)', borderRadius: 'var(--radius-md)'}}>
                            <p style={{margin: 0, fontSize: '1.1rem'}}>Total Price: <strong>₹{calculateTotalAmount()}</strong></p>
                            {bookingForm.checkInDate && bookingForm.checkOutDate && (
                                <p style={{margin: 0, marginTop: '0.25rem', fontSize: '0.9rem', color: 'var(--gray)'}}>
                                    ₹{selectedRoom?.price} × {Math.max(1, Math.ceil((new Date(bookingForm.checkOutDate).getTime() - new Date(bookingForm.checkInDate).getTime()) / (1000 * 60 * 60 * 24)))} night(s)
                                </p>
                            )}
                        </div>
                        
                        <form onSubmit={confirmBooking}>
                            <div className="input-group">
                                <label className="input-label">Full Name</label>
                                <input required className="input-field" value={bookingForm.guestName} onChange={e => setBookingForm({...bookingForm, guestName: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Phone Number</label>
                                <input required type="tel" className="input-field" value={bookingForm.guestPhone} onChange={e => setBookingForm({...bookingForm, guestPhone: e.target.value})} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input disabled className="input-field" value={user.email} style={{backgroundColor: 'var(--gray-light)'}} />
                            </div>
                            
                            <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                                <div className="input-group" style={{flex: 1, marginBottom: 0}}>
                                    <label className="input-label">Check-in Date</label>
                                    <input required type="date" min={new Date().toISOString().split('T')[0]} className="input-field" value={bookingForm.checkInDate} onChange={e => setBookingForm({...bookingForm, checkInDate: e.target.value})} />
                                </div>
                                <div className="input-group" style={{flex: 1, marginBottom: 0}}>
                                    <label className="input-label">Check-out Date</label>
                                    <input required type="date" min={bookingForm.checkInDate || new Date().toISOString().split('T')[0]} className="input-field" value={bookingForm.checkOutDate} onChange={e => setBookingForm({...bookingForm, checkOutDate: e.target.value})} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Payment Method</label>
                                <select className="input-field" value={bookingForm.paymentMethod} onChange={e => setBookingForm({...bookingForm, paymentMethod: e.target.value})}>
                                    <option value="ONLINE">Online Payment (UPI)</option>
                                    <option value="CASH">Cash on Arrival</option>
                                </select>
                            </div>

                            {bookingForm.paymentMethod === 'ONLINE' && (
                                <div style={{textAlign: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--light)', borderRadius: 'var(--radius-md)'}}>
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi%3A%2F%2Fpay%3Fpa%3Dshreyasdr.gowda25%40oksbi%26pn%3DShreyas%2520DR%26cu%3DINR%26am%3D${calculateTotalAmount()}`} 
                                        alt="UPI QR Code Scanner" 
                                        style={{margin: '0 auto', width: '150px', height: '150px', borderRadius: '8px', padding: '0.5rem', background: '#fff', border: '1px solid #ddd'}} 
                                    />
                                    <p style={{marginTop: '1rem', fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937'}}>Scan to pay ₹{calculateTotalAmount()}</p>
                                    <p style={{marginTop: '0.25rem', fontSize: '0.95rem', color: '#4b5563'}}>UPI ID: <strong>shreyasdr.gowda25@oksbi</strong></p>
                                    
                                    <div style={{marginTop: '1.5rem', textAlign: 'left', borderTop: '1px solid #e5e7eb', paddingTop: '1rem'}}>
                                        <label className="input-label" style={{color: '#b91c1c', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem'}}>* Enter 12-Digit UTR Number After Payment</label>
                                        <input 
                                            required={bookingForm.paymentMethod === 'ONLINE'} 
                                            type="text" 
                                            minLength={12} 
                                            maxLength={12} 
                                            placeholder="e.g. 312345678901" 
                                            className="input-field" 
                                            value={bookingForm.utrNumber} 
                                            onChange={e => setBookingForm({...bookingForm, utrNumber: e.target.value.replace(/\D/g, '').slice(0, 12)})} 
                                            style={{borderColor: '#ef4444', backgroundColor: '#fef2f2'}} 
                                        />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn btn-secondary" style={{width: '100%', padding: '1rem', fontSize: '1.1rem'}}>Confirm Booking</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomestayDetail;
