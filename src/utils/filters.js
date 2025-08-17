export function filterCompaniesByCountryAndIndustry(companies, country, industry) {
    return companies.filter(company => {
        const countryMatch = !country || company.country === country;
        const industryMatch = !industry || company.industry === industry;
        return countryMatch && industryMatch;
    });
}
