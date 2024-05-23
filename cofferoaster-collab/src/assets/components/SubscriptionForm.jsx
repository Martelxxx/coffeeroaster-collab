// 1. Importing necessary modules and hooks from React and other utilities const [coffeeType, setCoffeeType] = useState('');
const [grindDisabled, setGrindDisabled] = useState(false);

const handleCoffeeTypeChange = (event) => {
  const selectedType = event.target.value;
  setCoffeeType(selectedType);
  if (selectedType === 'Capsule') {
    setGrindDisabled(true);
  } else {
    setGrindDisabled(false);
  }
const [weight, setWeight] = useState('250g');
const [frequency, setFrequency] = useState('Every Week');
const [pricePerShipment, setPricePerShipment] = useState(7.20);

useEffect(() => {
  const prices = {
    '250g': { 'Every Week': 7.20, 'Every 2 Weeks': 9.60, 'Every Month': 12.00 },
    '500g': { 'Every Week': 13.00, 'Every 2 Weeks': 17.50, 'Every Month': 22.00 },
    '1000g': { 'Every Week': 22.00, 'Every 2 Weeks': 32.00, 'Every Month': 42.00 }
  };
  setPricePerShipment(prices[weight][frequency]);
}, [weight, frequency]);

const getOrderSummary = () => {
    let summary = `I drink my coffee ${coffeeType === 'Capsule' ? 'using' : 'as'} ${coffeeType}`;
    if (!grindDisabled) {
      summary += ` with a ${grindOption} grind`;
    }
    return summary;
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={coffeeType} onChange={handleCoffeeTypeChange}>
          <option value="Capsule">Capsule</option>
          <option value="Filter">Filter</option>
          <option value="Espresso">Espresso</option>
        </select>
        <select disabled={grindDisabled} value={grindOption} onChange={e => setGrindOption(e.target.value)}>
          {/* Grind options */}
        </select>
        <select value={weight} onChange={e => setWeight(e.target.value)}>
          <option value="250g">250g</option>
          <option value="500g">500g</option>
          <option value="1000g">1000g</option>
        </select>
        <select value={frequency} onChange={e => setFrequency(e.target.value)}>
          <option value="Every Week">Every Week</option>
          <option value="Every 2 Weeks">Every 2 Weeks</option>
          <option value="Every Month">Every Month</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      <OrderSummaryModal summary={getOrderSummary()} monthlyCost={pricePerShipment * getMonthlyMultiplier(frequency)} />
    </div>
  );
}

export default SubscriptionForm;