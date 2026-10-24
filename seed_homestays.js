const homestays = [
  {
    name: "Cozy Mountain Retreat",
    address: "Whispering Pines Road, Manali, Himachal Pradesh",
    locationMapUrl: "https://maps.google.com/?q=Manali",
    photoUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop",
    adminEmail: "admin@homestay.com",
    averageRating: 4.8,
    rooms: [
      {
        numberOfBeds: 2,
        isAc: false,
        price: 2500,
        hasWifi: true,
        otherFeatures: "Balcony with mountain view",
        photoUrl: "https://images.unsplash.com/photo-1598928506311-c9514e18faa1?q=80&w=800&auto=format&fit=crop"
      },
      {
        numberOfBeds: 1,
        isAc: false,
        price: 1500,
        hasWifi: true,
        otherFeatures: "Cozy attic room",
        photoUrl: "https://images.unsplash.com/photo-1522771731535-64903cdcd425?q=80&w=800&auto=format&fit=crop"
      }
    ]
  },
  {
    name: "Serene Beachside Villa",
    address: "Palolem Beach, South Goa",
    locationMapUrl: "https://maps.google.com/?q=Palolem+Beach",
    photoUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop",
    adminEmail: "admin@homestay.com",
    averageRating: 4.5,
    rooms: [
      {
        numberOfBeds: 2,
        isAc: true,
        price: 4500,
        hasWifi: true,
        otherFeatures: "Sea View, Mini Fridge",
        photoUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format&fit=crop"
      },
      {
        numberOfBeds: 4,
        isAc: true,
        price: 8000,
        hasWifi: true,
        otherFeatures: "Family Suite, Kitchenette",
        photoUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop"
      }
    ]
  },
  {
    name: "Heritage Kerala Houseboat",
    address: "Punnamada Lake, Alleppey, Kerala",
    locationMapUrl: "https://maps.google.com/?q=Alleppey",
    photoUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
    adminEmail: "admin@homestay.com",
    averageRating: 4.9,
    rooms: [
      {
        numberOfBeds: 2,
        isAc: true,
        price: 6500,
        hasWifi: false,
        otherFeatures: "Onboard dining, Deck access",
        photoUrl: "https://images.unsplash.com/photo-1623861864096-74fcce58fde6?q=80&w=800&auto=format&fit=crop"
      }
    ]
  }
];

async function seed() {
  for (const homestay of homestays) {
    const rooms = homestay.rooms;
    delete homestay.rooms;
    
    try {
      const res = await fetch('http://localhost:8080/api/homestays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(homestay)
      });
      const savedHomestay = await res.json();
      console.log(`Created homestay: ${savedHomestay.name} (ID: ${savedHomestay.id})`);
      
      for (const room of rooms) {
        const roomRes = await fetch(`http://localhost:8080/api/homestays/${savedHomestay.id}/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(room)
        });
        if (roomRes.ok) {
          console.log(`  Added room for ${savedHomestay.name}`);
        } else {
          console.error(`  Failed to add room: ${roomRes.statusText}`);
        }
      }
    } catch (e) {
      console.error("Error creating homestay", e);
    }
  }
  console.log("Seeding complete!");
}

seed();
