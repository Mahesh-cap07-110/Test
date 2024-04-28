// Global variables
let employeesData = [];
let currentPage = 1;
const limitPerPage = 10;

// Fetch employee data from API
async function fetchEmployees() {
  try {
    const response = await fetch('https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees');
    const data = await response.json();
    employeesData = data.data;
    paginateEmployees(currentPage, limitPerPage, employeesData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Populate employee data in table
function populateEmployees(employees) {
  const tableBody = document.getElementById('employee-data');
  tableBody.innerHTML = '';

  employees.forEach((employee, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${employee.name}</td>
        <td>${employee.gender}</td>
        <td>${employee.department}</td>
        <td>${employee.salary}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Implement pagination
function paginateEmployees(page, limit, employees) {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = employees.slice(start, end);
  populateEmployees(paginatedData);

  const prevButton = document.getElementById('prev-btn');
  const nextButton = document.getElementById('next-btn');

  prevButton.disabled = page === 1;
  nextButton.disabled = end >= employees.length;
}

// Filter employees by department
function filterByDepartment(department, employees) {
  if (department === '') return employees;
  return employees.filter(employee => employee.department === department);
}

// Filter employees by gender
function filterByGender(gender, employees) {
  if (gender === '') return employees;
  return employees.filter(employee => employee.gender === gender);
}

// Sort employees by salary
function sortBySalary(order, employees) {
  if (order === 'asc') {
    return employees.sort((a, b) => a.salary - b.salary);
  } else if (order === 'desc') {
    return employees.sort((a, b) => b.salary - a.salary);
  }
}

// Event listeners for dropdowns and pagination buttons
document.addEventListener('DOMContentLoaded', () => {
  fetchEmployees();

  const departmentDropdown = document.getElementById('department');
  const genderDropdown = document.getElementById('gender');
  const sortDropdown = document.getElementById('sort');
  const prevButton = document.getElementById('prev-btn');
  const nextButton = document.getElementById('next-btn');

  departmentDropdown.addEventListener('change', () => {
    const department = departmentDropdown.value;
    const filteredEmployees = filterByDepartment(department, employeesData);
    const gender = genderDropdown.value;
    const sortedEmployees = sortBySalary(sortDropdown.value, filteredEmployees);
    paginateEmployees(1, limitPerPage, filterByGender(gender, sortedEmployees));
    currentPage = 1;
  });

  genderDropdown.addEventListener('change', () => {
    const gender = genderDropdown.value;
    const filteredEmployees = filterByGender(gender, employeesData);
    const department = departmentDropdown.value;
    const sortedEmployees = sortBySalary(sortDropdown.value, filteredEmployees);
    paginateEmployees(1, limitPerPage, filterByDepartment(department, sortedEmployees));
    currentPage = 1;
  });

  sortDropdown.addEventListener('change', () => {
    const order = sortDropdown.value;
    const department = departmentDropdown.value;
    const gender = genderDropdown.value;
    const sortedEmployees = sortBySalary(order, employeesData);
    paginateEmployees(1, limitPerPage, filterByGender(gender, filterByDepartment(department, sortedEmployees)));
    currentPage = 1;
  });

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      const department = departmentDropdown.value;
      const gender = genderDropdown.value;
      const sortedEmployees = sortBySalary(sortDropdown.value, employeesData);
      paginateEmployees(currentPage, limitPerPage, filterByGender(gender, filterByDepartment(department, sortedEmployees)));
    }
  });

  nextButton.addEventListener('click', () => {
    const totalPages = Math.ceil(employeesData.length / limitPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      const department = departmentDropdown.value;
      const gender = genderDropdown.value;
      const sortedEmployees = sortBySalary(sortDropdown.value, employeesData);
      paginateEmployees(currentPage, limitPerPage, filterByGender(gender, filterByDepartment(department, sortedEmployees)));
    }
  });
});
