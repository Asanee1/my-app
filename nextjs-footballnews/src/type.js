// src/types.js

// Represents API options, including headers for requests
export const apiOptions = {
    next: null, // Placeholder for API options or configurations
    headers: {
      'X-Auth-Token': '', // API Key
      'Content-Type': '' // Content Type
    }
  };
  
  // Represents the area of a match (e.g., region)
  export const matchesArea = {
    id: null, // Optional ID (number or null)
    name: '' // Name of the area (string)
  };
  
  // Represents the competition (e.g., league) details
  export const matchesCompetition = {
    id: null, // Optional ID (number or null)
    name: '', // Name of the competition (string)
    emblem: '' // URL to the competition's emblem/logo (string)
  };
  
  // Represents the home team in a match
  export const matchesHomeTeam = {
    id: null, // Optional ID (number or null)
    name: '', // Name of the home team (string)
    crest: '' // URL to the team's crest/logo (string)
  };
  
  // Represents the away team in a match
  export const matchesAwayTeam = {
    id: null, // Optional ID (number or null)
    name: '', // Name of the away team (string)
    crest: '' // URL to the team's crest/logo (string)
  };
  
  // Represents scores for a match
  export const scores = {
    fullTime: {
      home: 0, // Full-time home score (number)
      away: 0  // Full-time away score (number)
    },
    halfTime: {
      home: 0, // Optional half-time home score (number or undefined)
      away: 0  // Optional half-time away score (number or undefined)
    }
  };
  
  // Represents a match with various details
  export const matchesType = {
    area: matchesArea, // Area of the match
    competition: matchesCompetition, // Competition details
    id: 0, // Match ID (number)
    utcDate: '', // UTC Date of the match (string)
    status: '', // Status of the match (e.g., finished, scheduled) (string)
    matchday: null, // Optional match day (number or null)
    homeTeam: matchesHomeTeam, // Details of the home team
    awayTeam: matchesAwayTeam, // Details of the away team
    score: scores // Scores of the match
  };
  
  // Represents a news item with related details
  export const newsType = {
    title: '', // Title of the news item (string)
    url: '', // URL to the news item (string)
    urlToImage: '' // URL to the image for the news item (string)
  };
  