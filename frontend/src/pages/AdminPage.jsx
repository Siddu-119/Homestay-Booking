import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, MapPin } from 'lucide-react';

const AdminPage = () => {
    const { user } = useAuth();
    const [homestays, setHomestays] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state for Homestay
    const [hsForm, setHsForm] = useState({ name: '', address: '', locationMapUrl: '', photoFile: null });
    
    // Form state for Room
    const [roomForm, setRoomForm] = useState({ numberOfBeds: 1, isAc: false, price: '', hasWifi: true, otherFeatures: '', photoFile: null });

    const isSuperAdmin = user?.email === 'shreyasdrshreyasdr@gmail.com';

    useEffect(() => {
        if (user) {
            fetchHomestays();
        }
    }, [user]);

    const fetchHomestays = async () => {
        try {
            const url = isSuperAdmin 
                ? `http://localhost:8080/api/homestays`
                : `http://localhost:8080/api/homestays/admin/${user.email}`;
            const res = await axios.get(url);
            setHomestays(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHomestay = async (e) => {
        e.preventDefault();
        try {
            let uploadedPhotoUrl = '';
            
            if (hsForm.photoFile) {
                const formData = new FormData();
                formData.append('file', hsForm.photoFile);
                const uploadRes = await axios.post('http://localhost:8080/api/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedPhotoUrl = uploadRes.data.url;
            }

            await axios.post('http://localhost:8080/api/homestays', {
                name: hsForm.name,
                address: hsForm.address,
                locationMapUrl: hsForm.locationMapUrl,
                photoUrl: uploadedPhotoUrl,
                adminEmail: user.email // Super admins will still own what they create
            });
            setHsForm({ name: '', address: '', locationMapUrl: '', photoFile: null });
            fetchHomestays();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteHomestay = async (id) => {
        if (!window.confirm("Are you sure you want to delete this homestay?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/homestays/${id}`);
            fetchHomestays();
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddRoom = async (e, homestayId) => {
        e.preventDefault();
        try {
            let uploadedPhotoUrl = '';
            if (roomForm.photoFile) {
                const formData = new FormData();
                formData.append('file', roomForm.photoFile);
                const uploadRes = await axios.post('http://localhost:8080/api/uploads', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedPhotoUrl = uploadRes.data.url;
            }

            await axios.post(`http://localhost:8080/api/homestays/${homestayId}/rooms`, {
                numberOfBeds: roomForm.numberOfBeds,
                isAc: roomForm.isAc,
                price: roomForm.price,
                hasWifi: roomForm.hasWifi,
                otherFeatures: roomForm.otherFeatures,
                photoUrl: uploadedPhotoUrl
            });
            setRoomForm({ numberOfBeds: 1, isAc: false, price: '', hasWifi: true, otherFeatures: '', photoFile: null });
            fetchHomestays();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteRoom = async (homestayId, roomId) => {
        try {
            await axios.delete(`http://localhost:8080/api/homestays/${homestayId}/rooms/${roomId}`);
            fetchHomestays();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="container" style={{padding: '2rem'}}>Loading...</div>;

    const renderRegistrationForm = () => (
        <div className="card animate-fade-in" style={{padding: '2rem', maxWidth: '600px', margin: '0 auto', marginBottom: '3rem'}}>
            <h2 style={{marginBottom: '1.5rem'}}>Register A New Homestay</h2>
            <form onSubmit={handleCreateHomestay}>
                <div className="input-group">
                    <label className="input-label">Homestay Name</label>
                    <input required className="input-field" value={hsForm.name} onChange={e => setHsForm({...hsForm, name: e.target.value})} placeholder="e.g. Sunny Hills Retreat" />
                </div>
                <div className="input-group">
                    <label className="input-label">Address</label>
                    <input required className="input-field" value={hsForm.address} onChange={e => setHsForm({...hsForm, address: e.target.value})} placeholder="e.g. 123 Main St, City" />
                </div>
                <div className="input-group">
                    <label className="input-label">Location (Map string/URL)</label>
                    <input required className="input-field" value={hsForm.locationMapUrl} onChange={e => setHsForm({...hsForm, locationMapUrl: e.target.value})} placeholder="e.g. 12.9716, 77.5946 or Bangalore" />
                </div>
                <div className="input-group">
                    <label className="input-label">Homestay Photo</label>
                    <input type="file" required accept="image/*" className="input-field" onChange={e => setHsForm({...hsForm, photoFile: e.target.files[0]})} style={{paddingTop: '0.5rem'}} />
                </div>
                <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '0.75rem'}}>Register Homestay</button>
            </form>
        </div>
    );

    return (
        <div className="container" style={{padding: '2rem'}}>
            {isSuperAdmin && (
                <div style={{background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center'}}>
                    <strong>Super Admin Mode Active:</strong> You can manage all homestays in the system.
                </div>
            )}
            
            {(homestays.length === 0 || isSuperAdmin) && renderRegistrationForm()}

            {homestays.map((hs, index) => (
                <div key={hs.id} style={{marginBottom: '5rem', paddingBottom: '3rem', borderBottom: index < homestays.length - 1 ? '2px solid #eee' : 'none'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                        <h2>Profile: {hs.name}</h2>
                        <button className="btn btn-danger" onClick={() => handleDeleteHomestay(hs.id)}>
                            <Trash2 size={18}/> Remove Homestay
                        </button>
                    </div>

                    <div className="card animate-fade-in" style={{marginBottom: '3rem'}}>
                        <img src={hs.photoUrl} alt={hs.name} style={{width: '100%', height: '300px', objectFit: 'cover'}} />
                        <div style={{padding: '2rem'}}>
                            <h3 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{hs.name}</h3>
                            {hs.address && <p style={{fontSize: '1.1rem', color: 'var(--gray)', marginBottom: '1rem'}}>{hs.address}</p>}
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hs.locationMapUrl)}`} target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', textDecoration: 'none', color: 'inherit'}}>
                                <MapPin size={20}/> {hs.locationMapUrl}
                            </a>
                            {isSuperAdmin && <p style={{marginTop: '0.5rem', opacity: 0.7}}>Managed by: {hs.adminEmail}</p>}
                        </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                        <div>
                            <h3 style={{marginBottom: '1rem'}}>Manage Rooms</h3>
                            <div className="card" style={{padding: '1.5rem'}}>
                                <h4 style={{marginBottom: '1rem'}}>Add a New Room</h4>
                                <form onSubmit={(e) => handleAddRoom(e, hs.id)}>
                                    <div className="input-group">
                                        <label className="input-label">Number of Beds</label>
                                        <input type="number" min="1" required className="input-field" value={roomForm.numberOfBeds} onChange={e => setRoomForm({...roomForm, numberOfBeds: parseInt(e.target.value)})} />
                                    </div>
                                    <div style={{display: 'flex', gap: '1rem', marginBottom: '1rem'}}>
                                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                            <input type="checkbox" checked={roomForm.isAc} onChange={e => setRoomForm({...roomForm, isAc: e.target.checked})} /> AC Room
                                        </label>
                                        <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                            <input type="checkbox" checked={roomForm.hasWifi} onChange={e => setRoomForm({...roomForm, hasWifi: e.target.checked})} /> Free Wi-Fi
                                        </label>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Price per Night</label>
                                        <input type="number" required className="input-field" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} placeholder="₹" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Other Features</label>
                                        <input className="input-field" value={roomForm.otherFeatures} onChange={e => setRoomForm({...roomForm, otherFeatures: e.target.value})} placeholder="e.g. Geyser, TV, Balcony" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Room Photo</label>
                                        <input type="file" required accept="image/*" className="input-field" onChange={e => setRoomForm({...roomForm, photoFile: e.target.files[0]})} style={{paddingTop: '0.5rem'}} />
                                    </div>
                                    <button type="submit" className="btn btn-secondary" style={{width: '100%'}}><Plus size={18}/> Add Room</button>
                                </form>
                            </div>
                        </div>

                        <div>
                            <h3 style={{marginBottom: '1rem'}}>Current Rooms ({hs.rooms.length})</h3>
                            {hs.rooms.map((room, idx) => (
                                <div key={room.id} className="card" style={{display: 'flex', marginBottom: '1rem', overflow: 'hidden'}}>
                                    <img src={room.photoUrl} style={{width: '120px', objectFit: 'cover'}} alt="Room" />
                                    <div style={{padding: '1rem', flex: 1}}>
                                        <h4>Room {idx + 1}</h4>
                                        <p style={{marginBottom: '0.5rem', fontSize: '0.9rem'}}>{room.numberOfBeds} Beds • {room.isAc ? 'AC' : 'Non-AC'} • {room.hasWifi ? 'Wi-Fi' : 'No Wi-Fi'}</p>
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                            <span style={{fontWeight: 'bold', color: 'var(--primary)'}}>₹{room.price} / night</span>
                                            <button onClick={() => handleDeleteRoom(hs.id, room.id)} className="btn btn-danger" style={{padding: '0.25rem 0.5rem', fontSize: '0.875rem'}}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {hs.rooms.length === 0 && <p className="glass" style={{padding: '1rem', borderRadius: 'var(--radius-md)'}}>No rooms added yet. Add your first room to start accepting guests.</p>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminPage;
