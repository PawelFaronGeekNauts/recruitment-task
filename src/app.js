import { fetchCompaniesData } from './services/api.js';
import { filterCompaniesByCountryAndIndustry } from './utils/filters.js';
import { sortCompanies } from './utils/sorters.js';

class CompanyDataApp {
    constructor() {
        this.data = [];
        this.initializeElements();
        this.initializeEventListeners();
        this.fetchData();
    }

    initializeElements() {
        this.countryFilter = document.getElementById('countryFilter');
        this.industryFilter = document.getElementById('industryFilter');

        this.sortField = document.getElementById('sortField');
        this.sortOrder = document.getElementById('sortOrder');

        this.loader = document.getElementById('loader');

        this.companiesList = document.getElementById('companiesList');
        
        this.modal = document.getElementById('companyModal');
        this.modalTitle = this.modal.querySelector('.modal-title');
        this.modalClose = this.modal.querySelector('.modal-close');
    }

    initializeEventListeners() {
        this.countryFilter.addEventListener('change', () => this.updateDisplay());
        this.industryFilter.addEventListener('change', () => this.updateDisplay());
        
        this.sortField.addEventListener('change', () => this.updateDisplay());
        this.sortOrder.addEventListener('change', () => this.updateDisplay());
        

        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    async fetchData() {
        try {
            this.loader.style.display = 'block';
            this.data = await fetchCompaniesData();
            this.initializeFilters();
            this.updateDisplay();
            this.loader.style.display = 'none';
        } catch (error) {
            console.error('Error fetching data:', error);
            this.loader.textContent = 'Error loading data. Please try again later.';
        }
    }

    initializeFilters() {
        const countries = [...new Set(this.data.map(item => item.country))].sort();
        const industries = [...new Set(this.data.map(item => item.industry))].sort();
        
        this.populateFilter(this.countryFilter, countries);
        this.populateFilter(this.industryFilter, industries);
    }

    populateFilter(selectElement, options) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    updateDisplay() {
        const filteredData = filterCompaniesByCountryAndIndustry(
            this.data,
            this.countryFilter.value,
            this.industryFilter.value
        );

        const sortedData = sortCompanies(
            filteredData,
            this.sortField.value,
            this.sortOrder.value
        );

        this.renderCompanies(sortedData);
    }

    renderCompanies(companies) {
        this.companiesList.innerHTML = '';
        
        if (companies.length === 0) {
            this.companiesList.innerHTML = `
            <li class="company-card">
                <div>
                    <p> No companies found for specific criteria</p>
                </div>
            </li>`;
            return;
        }
        
        companies.forEach(company => {
            const li = document.createElement('li');
            li.className = 'company-card';
            li.innerHTML = `
                <div class="company-name">${company.name}</div>
                <div class="company-details">
                    <p>Country: ${company.country}</p>
                    <p>Industry: ${company.industry}</p>
                    <p>Employees: ${company.numberOfEmployees.toLocaleString()}</p>
                </div>
            `;
            
            li.addEventListener('click', () => this.showCompanyDetails(company));
            
            this.companiesList.appendChild(li);
        });

        this.companiesList.setAttribute('aria-label', `Companies list showing ${companies.length} results`);
    }

    showCompanyDetails(company) {
        this.modalTitle.textContent = company.name;
        
        const fields = {
            country: company.country,
            industry: company.industry,
            employees: company.numberOfEmployees.toLocaleString()
        };

        Object.entries(fields).forEach(([field, value]) => {
            const element = this.modal.querySelector(`[data-field="${field}"]`);
            if (element) element.textContent = value;
        });

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CompanyDataApp();
});