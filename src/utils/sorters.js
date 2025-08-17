export function sortCompanies(companies, field, order) {
    return [...companies].sort((a, b) => {
        let comparison = field === 'name' 
            ? a.name.localeCompare(b.name)
            : a.numberOfEmployees - b.numberOfEmployees;
        return order === 'asc' ? comparison : -comparison;
    });
}