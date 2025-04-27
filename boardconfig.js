// Literally just a JSON that I've kept as a .JS in case I want to add any functions later

export const boardConfig = {
    size: 11,
    
    debug_mode: true,
  
    islands: [
      { q: 6, r: 3 },
      { q: 5, r: 5 },
      { q: 4, r: 7 },
      { q: 1, r: 3 },
      { q: 0, r: 5 },
      { q: -1, r: 7 },
      { q: 3, r: 4 },
      { q: 2, r: 6 },
    ],
  
    bays: [
      { q: 5, r: 4 },
      { q: 6, r: 4 },
      { q: 4, r: 6 },
      { q: 5, r: 6 },
      { q: 0, r: 4 },
      { q: 1, r: 4 },
      { q: -1, r: 6 },
      { q: 0, r: 6 },
      { q: 2, r: 5 },
      { q: 3, r: 5 },
    ],
  
    initialShips: [
      { q: -1, r: 3, type: 'Brig' },
      { q: 8, r: 3, type: 'Brig' },
      { q: 1, r: 2, type: 'Sloop' },
      { q: 3, r: 2, type: 'Sloop' },
      { q: 5, r: 2, type: 'Sloop' },
      { q: 7, r: 2, type: 'Sloop' },
      { q: 2, r: 0, type: 'Sloop' },
      { q: 8, r: 0, type: 'Sloop' },
      { q: 5, r: 0, type: 'Frigate' },
  ],

    shipTypes: {
      "Frigate": {
        "symbol":"⛤",
        "moves":5,
        "straight_line_only": true,
      },
      "Brig": {
        "symbol":"⚔",
        "moves":2,
        "straight_line_only": false,
      },
      "Sloop": {
        "symbol":"⚜",
        "moves":3,
        "straight_line_only": true,
      }
    }
  };
  