export const calculateWinProbability = (homeStrength, awayStrength) => {
    const total = homeStrength + awayStrength;
    return {
      homeWin: (homeStrength / total) * 100,
      awayWin: (awayStrength / total) * 100,
    };
  };
  