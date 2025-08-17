export async function fetchCompaniesData() {
        const response = await fetch('https://dujour.squiz.cloud/developer-challenge/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
}