import { useState, useEffect } from 'react';
import './App.css';
import { fetchCoffees } from '/services/coffeeService';
import * as coffeeService from '/services/coffeeService.js';


const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', type: '' });
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('drinks');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedItemType, setSelectedItemType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewItem({ ...newItem, [name]: value });
    setCharCount(value.length);

    if (value.length < 100) {
      setErrorMessage('Please enter a description that is at least 100 characters long.');
    } else {
      setErrorMessage('');
    }
  };

  const handleDelete = async (id) => {
    const password = window.prompt('Please enter your password to delete this item.');
    if (password === 'brewjs') {
      fetch(`http://localhost:3002/coffees/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          setItems(items.filter((item) => item.id !== id));
          window.location.reload(); // Refresh the page after deletion
          alert('Item deleted successfully.');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      alert('Incorrect password. Please try again.');
    }
  };
    
  const handleFormSubmit = async (event) => {
  if (newItem.description.length < 100) {
    event.preventDefault();
    setErrorMessage('Description must be at least 100 characters long.');
  } else {
    setErrorMessage('');
  
    fetch('http://localhost:3002/coffees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => response.json())
      .then((data) => {
        setItems([...items, data]);
        setNewItem({ name: '', description: '', type: 'drink' });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
};

  const handleAddToCart = (item) => {
    const size = selectedSizes[item._id] || 'Medium';
    const sizeMultiplier = size === 'Small' ? 0.8 : size === 'Large' ? 1.2 : 1;
    const price = (((item.description.length + item.name.length) / 30) * sizeMultiplier).toFixed(2);
    setCart((prevCart) => [...prevCart, { ...item, size, price }]);
    setSelectedItemType(item.type);

  };

  const handleCheckout = () => {
    setShowForm(true);
  };

  const handleSizeChange = (size, id) => {
    setSelectedSizes((prevSizes) => ({ ...prevSizes, [id]: size }));
  };

  useEffect(() => {
    // Function to fetch items data
    const fetchItemsData = async () => {
      const data = await fetchCoffees(); // Assuming this fetches both drinks and food items
      console.log('Fetched data:', data); // Debug: Log fetched data
      setItems(data);
    };

    // Initialize the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            setNewItem((prevState) => {
              const newDescription = (prevState.description || '') + event.results[i][0].transcript;
              setCharCount(newDescription.length);
              return {
                ...prevState,
                description: newDescription,
              };
            });
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setCharCount((prevState) => (prevState.description ? prevState.description.length : 0) + interimTranscript.length);
      };
      setRecognition(recognitionInstance);
    } else {
      console.error('Web Speech API is not supported by this browser.');
    }

    // Fetch the items data
    fetchItemsData();
  }, []);

  const totalPrice = Math.ceil(cart.reduce((total, item) => total + Number(item.price), 0) * 20) / 20;

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const filteredItems = items.filter((item) => item.type === selectedCategory);

  console.log('Filtered items:', filteredItems); // Debug: Log filtered items

  const handleListen = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleEdit = (id) => {
    const updatedItem = window.prompt('Please enter the updated item description:');
    if (updatedItem) {
      fetch(`http://localhost:3002/coffees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: updatedItem }),
      })
        .then((response) => response.json())
        .then((data) => {
          const updatedItems = items.map((item) => (item.id === id ? data : item));
          setItems(updatedItems);
          alert('Item updated successfully.');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  return (
    <div className="App">
      <header></header>

      <div className="right-sidebar">
        <h3>Cart</h3>
        <ul>
          {cart.map((item, index) => {
            return (
              <li key={index} className="cart-item">
                {item.type === 'drink' ? `(${item.size})` : ''} {item.name}: ${(Math.ceil(item.price * 20) / 20).toFixed(2)}
                <button onClick={() => removeFromCart(index)}>🗑️</button>
              </li>
            );
          })}
        </ul>
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        <button className="checkOut" onClick={handleCheckout}>
          <b>Checkout</b>
        </button>
        <br />
        {showForm && (
          <div className="checkoutForm">
          <form>
            <label>
              
              <input type="text" name="cardNumber" placeholder='Card Number:' />
            </label>
            <label>
             
              <input type="text" name="expiryDate" placeholder='Expiry Date:'/>
            </label>
            <label>
             
              <input type="text" name="cvv" placeholder='CVV:'/>
            </label>
            <button type="submit" onClick={() => alert('Thank You!')}>
              Confirm
            </button>
          </form>
          </div>
        )}
      </div>

      <div className="main">
      <main style={{ backgroundImage: `url(${selectedItemType === 'food' ? 'src/assets/croissant.png' : 'src/assets/mocha.png'})` }}>
        </main>
        <h2 className='mainBar'>Menu</h2>
        <div className="itemOption">
          <button onClick={() => setSelectedCategory('drink')}>Drinks ☕️</button>
          <button onClick={() => setSelectedCategory('food')}>Food 🥐</button>
        </div>
        <div className="items">
          {filteredItems.map((item, index) => {
            const sizeMultiplier =
              selectedSizes[item._id] === 'Small' ? 0.8 : selectedSizes[item._id] === 'Large' ? 1.2 : 1;
            const rawPrice = ((item.description.length + item.name.length) / 30) * sizeMultiplier;
            const price = (Math.ceil(rawPrice * 20) / 20).toFixed(2);
            return (
              <div className="itemType" key={index}>
                <h3>{item.name}</h3>
                <h4>Price: ${price}</h4>
                <p>{item.description}</p>

                <div className="itemButtons">
                  <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
                  <button onClick={() => handleEdit(item._id)}>Edit</button>
                  <button onClick={() => handleDelete(item._id)}>Remove</button>
                  {item.type === 'drink' && (
                    <div className="sizeOptions">
                      <label>
                        <input
                          type="radio"
                          value="Small"
                          name={`size-${index}`}
                          onChange={() => handleSizeChange('Small', item._id)}
                          required
                        />{' '}
                        Small
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="Medium"
                          name={`size-${index}`}
                          onChange={() => handleSizeChange('Medium', item._id)}
                          required
                          defaultChecked
                        />{' '}
                        Medium
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="Large"
                          name={`size-${index}`}
                          onChange={() => handleSizeChange('Large', item._id)}
                          required
                        />{' '}
                        Large
                      </label>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="left-sidebar">
        <h3>Add a New Item to Our Menu</h3>
        
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleInputChange}
            placeholder="Item Name"
            required
          />
          <div className="textarea-wrapper">
          <textarea
            type="text"
            name="description"
            value={newItem.description}
            onChange={handleInputChange}
            placeholder="Item Description"
            minLength="100"
            required
            rows="10"
            cols="50"
          />
          <div className={`char-count ${charCount < 100 ? 'red' : 'green'}`}>{charCount}</div>
          </div>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button className='mic' type="button" onClick={handleListen}>
          {isListening ? 'Stop Dictation' : 
          <>
          <img src='src/assets/mic.png' alt="Start Dictation" width="30" height="30" />
          Click to Speak
          </>
              }
          </button>
          <select name="type" value={newItem.type} onChange={handleInputChange} required>
            <option value="" disabled selected>
              What type of item are you making?
            </option>
            <option value="drink">Drink</option>
            <option value="food">Food</option>
          </select>
          <button type="submit">Add Item</button>
        </form>
        <h1>
          <img className="logo" src="src/assets/coffelogo.png" alt="Logo" />
        </h1>
      </div>
    </div>
  );
};


export default App;
