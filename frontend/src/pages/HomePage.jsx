import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';

const HomePage = () => {
    const [homestays, setHomestays] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHomestays('');
    }, []);

    const fetchHomestays = async (query) => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8080/api/homestays', {
                params: query ? { search: query } : {}
            });
            setHomestays(res.data);
        } catch (error) {
            console.error("Error fetching homestays", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchHomestays(searchQuery);
    };

    return (
        <div className="container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>Find Your Perfect Stay</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 0 2rem auto', marginLeft: 'auto', marginRight: 'auto' }}>
                    Discover top-rated homestays, cozy corners, and luxurious retreats.
                </p>

                <div className="card" style={{ padding: '1.5rem', margin: '0 auto 2rem auto', textAlign: 'left', background: 'rgba(255,255,255,0.8)' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={20} color="var(--primary)" /> Find Nearby Tourist Places
                    </h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        window.open(`https://www.google.com/maps/search/tourist+attractions+near+${encodeURIComponent(e.target.elements.touristLocation.value)}`, '_blank');
                    }} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                            name="touristLocation"
                            required
                            className="input-field" 
                            style={{ flex: 1, padding: '0.75rem 1rem' }}
                            placeholder="Enter a city or location to explore..." 
                        />
                        <button type="submit" className="btn btn-secondary" style={{ padding: '0 1.5rem', whiteSpace: 'nowrap' }}>
                            Explore with Google
                        </button>
                    </form>
                </div>
                
                <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '600px', margin: '0 auto', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}/>
                        <input 
                            className="input-field" 
                            style={{ paddingLeft: '3rem', fontSize: '1.1rem', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-xl)' }}
                            placeholder="Search by name, address, location, or rating..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-xl)', padding: '0 2rem' }}>
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center' }}>Loading homestays...</div>
            ) : (
                <>
                    <h2 style={{ marginBottom: '1.5rem' }}>Featured Homestays</h2>
                    {homestays.length === 0 ? (
                        <p className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>No homestays found matching your search.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {homestays.map(hs => (
                                <div key={hs.id} className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                    <Link to={`/homestay/${hs.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                        <img src={hs.photoUrl} alt={hs.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{hs.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 'bold' }}>
                                                    <Star size={18} fill="#fbbf24" />
                                                    <span>{hs.averageRating > 0 ? hs.averageRating.toFixed(1) : 'New'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                    <div style={{ padding: '0 1.5rem 1.5rem' }}>
                                        {hs.address && <p style={{ fontSize: '0.9rem', color: 'var(--gray)', margin: '0 0 0.5rem 0' }}>{hs.address}</p>}
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hs.locationMapUrl)}`} target="_blank" rel="noopener noreferrer" style={{display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gray)', fontSize: '0.9rem', marginBottom: '1rem', textDecoration: 'none'}}>
                                            <MapPin size={16} /> {hs.locationMapUrl}
                                        </a>
                                        <Link to={`/homestay/${hs.id}`} style={{textDecoration: 'none'}}>
                                            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--gray-light)', color: 'var(--primary)', fontWeight: '500' }}>
                                                View Details →
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
