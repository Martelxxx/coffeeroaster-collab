// Imports
import { useState, useEffect } from 'react';

// Parent Component

const App = () => {
    const [coffee, setCoffee] = useState([]);
    const [filteredCoffee, setFilteredCoffee] = useState([]);

    useEffect(() => {
        const fetchCoffee = async () => {
            const data = await fetchCoffee();
            setCoffee(data);
            setFilteredCoffee(data);
        }
        fetchCoffee();
    }
        ,[]);

    const handleSearch = async (searchTerm) => {
        const filtered = coffee.filter((coffee) => {
            return coffee.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredCoffee(filtered);
    }

    return (
        <div>
            <Search handleSearch={handleSearch} />
            <CoffeeList coffee={filteredCoffee} />
        </div>
    )
}

export default App;
