const BASE_URL = 'http://localhost:3002/coffees';

const fetchCoffees = async () => {
    try {
        const response = await fetch('http://localhost:3002/coffees');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
};

export { fetchCoffees };