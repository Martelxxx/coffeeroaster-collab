const fetchCoffees = async () => {
    try {
        const res = await fetch('http://localhost:3000/coffees');
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const createCoffee = async (formData) => {
    try {
        const res = await fetch('http://localhost:3000/coffees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const updateCoffee = async (formData, _id) => {
    try {
        const res = await fetch(`http://localhost:3000/coffees/${_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const deleteCoffee = async (_id) => {
    try {
        const res = await fetch(`http://localhost:3000/coffees/${_id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}


export { fetchCoffees, createCoffee, updateCoffee, deleteCoffee };
