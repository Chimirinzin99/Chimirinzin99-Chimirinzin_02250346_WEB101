export const monthlySales = [
    { month: 'Jan', sales: 25000, profit: 5000, target: 22000 },
    { month: 'Feb', sales: 28000, profit: 5600, target: 22000 },
    { month: 'Mar', sales: 32000, profit: 6400, target: 25000 },
    { month: 'Apr', sales: 34000, profit: 7100, target: 25000 },
    { month: 'May', sales: 30000, profit: 5800, target: 25000 },
    { month: 'Jun', sales: 29000, profit: 5400, target: 25000 },
    { month: 'Jul', sales: 33000, profit: 6200, target: 30000 },
    { month: 'Aug', sales: 38000, profit: 7900, target: 30000 },
    { month: 'Sep', sales: 36000, profit: 7200, target: 30000 },
    { month: 'Oct', sales: 34000, profit: 6800, target: 32000 },
    { month: 'Nov', sales: 39000, profit: 8100, target: 32000 },
    { month: 'Dec', sales: 45000, profit: 9800, target: 35000 }
];

export const productSales = [
    { name: 'Electronics', value: 35 },
    { name: 'Clothing', value: 25 },
    { name: 'Food', value: 20 },
    { name: 'Home Goods', value: 15 },
    { name: 'Other', value: 5 }
];

export const customerData = [
    { date: '2023-01-01', newCustomers: 120, returningCustomers: 240 },
    { date: '2023-02-01', newCustomers: 140, returningCustomers: 260 },
    { date: '2023-03-01', newCustomers: 160, returningCustomers: 270 },
    { date: '2023-04-01', newCustomers: 180, returningCustomers: 280 },
    { date: '2023-05-01', newCustomers: 170, returningCustomers: 290 },
    { date: '2023-06-01', newCustomers: 190, returningCustomers: 300 },
    { date: '2023-07-01', newCustomers: 210, returningCustomers: 310 },
    { date: '2023-08-01', newCustomers: 230, returningCustomers: 320 },
    { date: '2023-09-01', newCustomers: 220, returningCustomers: 330 },
    { date: '2023-10-01', newCustomers: 240, returningCustomers: 340 },
    { date: '2023-11-01', newCustomers: 260, returningCustomers: 350 },
    { date: '2023-12-01', newCustomers: 280, returningCustomers: 360 }
];

export const weeklyVisitors = Array.from({ length: 52 }, (_, i) => ({
    week: i + 1,
    visitors: Math.floor(Math.random() * 5000) + 10000
}));

export default {
    monthlySales,
    productSales,
    customerData,
    weeklyVisitors
};