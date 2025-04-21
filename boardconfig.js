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
      { player: 1, type: 'brig', q: 0, r: 0 },
      { player: 1, type: 'sloop', q: 1, r: 0 },
      { player: 1, type: 'sloop', q: 0, r: 1 },
  
      { player: 2, type: 'brig', q: 8, r: 8 },
      { player: 2, type: 'sloop', q: 7, r: 8 },
      { player: 2, type: 'sloop', q: 8, r: 7 },
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
  