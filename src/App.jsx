import { useState, useEffect } from 'react'
import './App.css'
import { fetchCoffees } from '/services/coffeeService'
import * as coffeeService from '/services/coffeeService.js'

const App = () => {
  const [coffees, setCoffees] = useState([])
  const [newCoffee, setNewCoffee] = useState({ name: '', description: '' })
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false)

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

const handleAddToCart = (coffee) => {
  const price = ((coffee.description.length + coffee.name.length) / 30).toFixed(2);
  setCart(prevCart => [...prevCart, {...coffee, price: price}]);
};

const handleCheckout = () => {
  setShowForm(true);
};

  useEffect(() => {
    const fetchCoffeesData = async () => {
      const data = await fetchCoffees();
      setCoffees(data)
    }
    fetchCoffeesData();
  }, [])

  const totalPrice = cart.reduce((total, coffee) => total + Number(coffee.price), 0);
  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  }
  
  return (
    <div className="App">
        <header>
            <h1>My Coffee Shop</h1>
        </header>
        
        <div className="right-sidebar">
            <h2>Cart</h2>
            <ul>
              {cart.map((coffee, index) => {
                return <li key={index}>{coffee.name}: ${coffee.price}
                <button onClick={() => removeFromCart(index)}>Remove</button>
                </li>;
              })}
            </ul>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleCheckout}>Checkout</button>
    {showForm && (
      <form>
        <label>
          Card Number:
          <input type="text" name="cardNumber" />
        </label>
        <label>
          Expiry Date:
          <input type="text" name="expiryDate" />
        </label>
        <label>
          CVV:
          <input type="text" name="cvv" />
        </label>
        <button type="submit" onClick={() => alert('Thank You!')}>Confirm</button>
      </form>
    )}
        </div>
        
        <div className="main">
            <h2>Menu</h2>
            <div className='coffees'>
              {coffees.map((coffee, index) => {
                const price = ((coffee.description.length + coffee.name.length) / 30).toFixed(2);
                return (
                  <div className='coffeeType' key={index}>
                    <h3>{coffee.name}</h3>
                    <h4>Price: ${price}</h4>              
                    <p>{coffee.description}</p>
                    <button onClick={() => handleAddToCart(coffee)}>Add to Cart</button>
                    <button onClick={() => handleDelete(coffee._id)}>Delete</button>
                  </div>
                );
              })}
            </div>
        </div>
        
        <div className="left-sidebar">
            <h2>Create a New Coffee</h2>
            <form onSubmit={handleFormSubmit}>
                <input 
                  type="text" 
                  name="name" 
                  value={newCoffee.name} 
                  onChange={handleInputChange} 
                  placeholder="Coffee Name" 
                  required 
                />
                <textarea 
                  type="text" 
                  name="description" 
                  value={newCoffee.description} 
                  onChange={handleInputChange} 
                  placeholder="Coffee Description" 
                  minLength="100"
                  required 
                />
                <button type="submit">Add Coffee</button>
            </form>
        </div>
    </div>
  );
};

export default App
