function Dashboard() {
    const [rooms, setRooms] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState({
      type: '',
      minPrice: 0,
      maxPrice: 1000
    });
    
    // Fetch rooms on component mount
    React.useEffect(() => {
      fetchRooms();
    }, []);
    
    // Fetch rooms from API
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rooms?' + new URLSearchParams(filter));
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      }
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault();
      fetchRooms();
    };
    
    // Handle booking a room
    const bookRoom = async (roomId) => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/book`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
          fetchRooms(); // Refresh rooms list
        }
      } catch (error) {
        console.error('Error booking room:', error);
      }
    };
    
    return (
      <div>
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Room Type</label>
              <select 
                className="w-full p-2 border rounded"
                value={filter.type}
                onChange={(e) => setFilter({...filter, type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Price ($)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded"
                value={filter.minPrice}
                onChange={(e) => setFilter({...filter, minPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Price ($)</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded"
                value={filter.maxPrice}
                onChange={(e) => setFilter({...filter, maxPrice: e.target.value})}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Search Rooms
          </button>
        </form>
        
        {loading ? (
          <div className="text-center">Loading rooms...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Room #</th>
                  <th className="py-2 px-4 border">Type</th>
                  <th className="py-2 px-4 border">Price</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td className="py-2 px-4 border">{room.number}</td>
                    <td className="py-2 px-4 border">{room.type}</td>
                    <td className="py-2 px-4 border">${room.price}</td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 rounded ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {room.available ? 'Available' : 'Booked'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <button 
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                        onClick={() => bookRoom(room.id)}
                        disabled={!room.available}
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Example: Fetch data from backend
fetch('http://localhost:5000/pricing')
.then(response => response.json())
.then(data => {
  console.log('Backend response:', data);
  // Update your HTML here
});