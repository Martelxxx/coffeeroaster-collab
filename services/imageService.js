const BASE_URL = 'http://localhost:3005/generate-image';

const fetchImages = async () => {
    try {
        const response = await fetch(BASE_URL, { method: 'POST' });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data1 = await response.text();
        console.log(data1);
        return data1;
    } catch (error) {
        console.error(error);
    }
}

export { fetchImages };