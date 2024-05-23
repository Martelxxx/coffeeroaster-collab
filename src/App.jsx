import { useState, useEffect } from 'react'
import './App.css'
import { fetchCoffees} from '/services/coffeeService'
import * as coffeeService from '/services/coffeeService.js'

const App = () => {
  const [coffees, setCoffees] = useState([])
  const [newCoffee, setNewCoffee] = useState({ name: '', description: '' })

  const handleInputChange = (event) => {
    setNewCoffee({ ...newCoffee, [event.target.name]: event.target.value })
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coffee?')) {
      fetch(`http://localhost:3002/coffees/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(() => {
        setCoffees(coffees.filter(coffee => coffee.id !== id));
        window.location.reload(); // Refresh the page after deletion
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    fetch('http://localhost:3002/coffees', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCoffee),
  })
    .then(response => response.json())
    .then(data => {
      setCoffees([...coffees, data]);
      setNewCoffee({ name: '', description: '' });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

  useEffect(() => {
    const fetchCoffeesData = async () => {
      const data = await fetchCoffees();
      setCoffees(data)
    }
    fetchCoffeesData();
  }, [])

  return (

    
    <div className="App">
        
        <h1>My Coffee Shop</h1>
        <h2>Menu</h2>
        <div className='coffees'>
          {coffees.map((coffee, index) => (
            <div className='coffeeType' key={index}>
              <h3>{coffee.name}</h3>
              <p>{coffee.description}</p>
              <button onClick={() => handleDelete(coffee._id)}>Delete</button>
            </div>
          ))}
          </div>
          <h2>Add a New Coffee</h2>
          <form onSubmit={handleFormSubmit}>
        <input 
          type="text" 
          name="name" 
          value={newCoffee.name} 
          onChange={handleInputChange} 
          placeholder="Coffee Name" 
          required 
        />
        <input 
          type="text" 
          name="description" 
          value={newCoffee.description} 
          onChange={handleInputChange} 
          placeholder="Coffee Description" 
          required 
        />
        <button type="submit">Add Coffee</button>
      </form>
    </div>
  );
};

export default App
