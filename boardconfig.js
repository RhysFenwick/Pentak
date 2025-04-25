// Literally just a JSON that I've kept as a .JS in case I want to add any functions later

export const boardConfig = {
    size: 9,
  
    islands: [
      { q: 3, r: 2 },
      { q: 2, r: 4 },
      { q: 1, r: 6 },
    ],
  
    bays: [
      { q: 2, r: 3 },
      { q: 3, r: 3 },
      { q: 1, r: 5 },
      { q: 2, r: 5 },
    ],
  
    initialShips: [
      { q: 0, r: 0, type: 'Sloop' },
      { q: 0, r: 2, type: 'Brig' },
      { q: 2, r: 0, type: 'Sloop' },
      { q: 4, r: 0, type: 'Frigate' },
      { q: 6, r: 2, type: 'Brig' },
      { q: 6, r: 0, type: 'Sloop' },
      { q: 8, r: 0, type: 'Sloop' }
  ],

    shipTypes: {
      "Frigate": {
        "symbol":"⛤",
        "moves":5
      },
      "Brig": {
        "symbol":"⚔",
        "moves":1
      },
      "Sloop": {
        "symbol":"⚜",
        "moves":2
      }
    }
  };
  