const nameList = [
    "Time", "Past", "Future", "Echo", "Tree", "Summer", "Tomato", "Guacamole",
    "Crackers", "Fracking", "Hell", "Gaspacho", "Pasta", "Carbonara", "Lasagne",
    "Formaggio", "Church", "Recon", "Desert", "Tropical", "Ocean", "Coral",
    "Train", "Firework", "Easter", "Egg", "Short", "Tall", "Solid", "Error",
    "Tacos", "Fries", "Steak"
];

export function getRandomName() {
    const rand0 = Math.floor(Math.random() * nameList.length);
    const rand1 = Math.floor(Math.random() * nameList.length);

    return `${nameList[rand0]}-${nameList[rand1]}`;
}
