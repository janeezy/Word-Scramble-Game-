/**
         * Word Scramble Game - Core JavaScript Implementation
         * Web3Bridge Cohort XIII Pre-Qualification Exercise
         * Author: [Jane Duru]
         * Date: 2025-26-05
         */

        class WordScrambleGame {
            constructor() {
                // Game data - Web3 and programming themed words
                this.wordDatabase = {
                    easy: [
                        { word: 'JAVASCRIPT', hint: 'Popular programming language for web development' },
                        { word: 'BLOCKCHAIN', hint: 'Distributed ledger technology' },
                        { word: 'ETHEREUM', hint: 'Popular cryptocurrency platform for smart contracts' },
                        { word: 'REACT', hint: 'JavaScript library for building user interfaces' },
                        { word: 'COMPUTER', hint: 'Electronic device for processing data' },
                        { word: 'INTERNET', hint: 'Global network of interconnected computers' },
                        { word: 'WEBSITE', hint: 'Collection of web pages accessible via the internet' },
                        { word: 'CODING', hint: 'Process of creating instructions for computers' },
                        { word: 'BITCOIN', hint: 'First and most well-known cryptocurrency' },
                        { word: 'FRONTEND', hint: 'User-facing part of web applications' }
                    ],
                    medium: [
                        { word: 'CRYPTOCURRENCY', hint: 'Digital currency secured by cryptography' },
                        { word: 'SMARTCONTRACT', hint: 'Self-executing contract with terms in code' },
                        { word: 'DECENTRALIZED', hint: 'Not controlled by a single central authority' },
                        { word: 'METAMASK', hint: 'Popular Ethereum wallet browser extension' },
                        { word: 'SOLIDITY', hint: 'Programming language for Ethereum smart contracts' },
                        { word: 'ALGORITHM', hint: 'Step-by-step procedure for solving problems' },
                        { word: 'DATABASE', hint: 'Organized collection of structured information' },
                        { word: 'FRAMEWORK', hint: 'Pre-written code structure for development' },
                        { word: 'PROGRAMMING', hint: 'Process of creating computer software' },
                        { word: 'VALIDATION', hint: 'Process of checking data accuracy and completeness' }
                    ],
                    hard: [
                        { word: 'INTEROPERABILITY', hint: 'Ability of different systems to work together' },
                        { word: 'CRYPTOGRAPHIC', hint: 'Related to secure communication techniques' },
                        { word: 'PERMISSIONLESS', hint: 'No authorization required to participate' },
                        { word: 'DECENTRALIZATION', hint: 'Distribution of power away from central authority' },
                        { word: 'TOKENOMICS', hint: 'Economics of cryptocurrency tokens' },
                        { word: 'SCALABILITY', hint: 'Ability to handle increased workload efficiently' },
                        { word: 'IMMUTABILITY', hint: 'Property of being unchangeable over time' },
                        { word: 'CONSENSUS', hint: 'General agreement among network participants' },
                        { word: 'DISTRIBUTED', hint: 'Spread across multiple locations or systems' },
                        { word: 'AUTHENTICATION', hint: 'Process of verifying user identity' }
                    ]
                };

                // Game state variables
                this.currentWord = null;
                this.scrambledWord = '';
                this.gameActive = false;
                this.score = 0;
                this.correctCount = 0;
                this.currentStreak = 0;
                this.bestStreak = 0;
                this.difficulty = 'easy';
                this.timeLeft = 30;
                this.timer = null;
                this.hintsUsed = 0;
                this.skipCount = 0;

                // Game statistics
                this.gameStats = {
                    totalGames: 0,
                    totalWordsAttempted: 0,
                    averageScore: 0,
                    fastestSolve: null
                };

                // Initialize the game
                this.initializeGame();
            }

            /**
             * Initialize game components and event listeners
             */
            initializeGame() {
                console.log('🎮 Initializing Word Scramble Game...');
                
                this.cacheElements();
                this.bindEventListeners();
                this.loadGameData();
                this.updateDisplay();
                
                console.log('✅ Game initialized successfully!');
            }

            /**
             * Cache DOM elements for better performance
             */
            cacheElements() {
                this.elements = {
                    // Word display
                    scrambledWord: document.getElementById('scrambled-word'),
                    
                    // Input elements
                    guessInput: document.getElementById('guess-input'),
                    
                    // Buttons
                    startBtn: document.getElementById('start-btn'),
                    submitBtn: document.getElementById('submit-btn'),
                    hintBtn: document.getElementById('hint-btn'),
                    skipBtn: document.getElementById('skip-btn'),
                    restartBtn: document.getElementById('restart-btn'),
                    
                    // Statistics
                    score: document.getElementById('score'),
                    correctCount: document.getElementById('correct-count'),
                    streak: document.getElementById('streak'),
                    
                    // Game info
                    difficulty: document.getElementById('difficulty'),
                    timer: document.getElementById('timer'),
                    progressFill: document.getElementById('progress-fill'),
                    
                    // Feedback sections
                    hintSection: document.getElementById('hint-section'),
                    hintText: document.getElementById('hint-text'),
                    feedbackSection: document.getElementById('feedback-section'),
                    feedbackMessage: document.getElementById('feedback-message'),
                    
                    // Game over
                    gameOverSection: document.getElementById('game-over-section'),
                    finalScore: document.getElementById('final-score'),
                    finalCorrect: document.getElementById('final-correct'),
                    finalStreak: document.getElementById('final-streak'),
                    
                    // Leaderboard
                    leaderboardList: document.getElementById('leaderboard-list')
                };

                // Verify all elements exist
                for (const [key, element] of Object.entries(this.elements)) {
                    if (!element) {
                        console.error(`❌ Element not found: ${key}`);
                    }
                }
            }

            /**
             * Bind event listeners to interactive elements
             */
            bindEventListeners() {
                // Button event listeners
                this.elements.startBtn.addEventListener('click', () => this.startGame());
                this.elements.submitBtn.addEventListener('click', () => this.submitGuess());
                this.elements.hintBtn.addEventListener('click', () => this.showHint());
                this.elements.skipBtn.addEventListener('click', () => this.skipWord());
                this.elements.restartBtn.addEventListener('click', () => this.restartGame());

                // Input event listeners
                this.elements.guessInput.addEventListener('keypress', (event) => {
                    if (event.key === 'Enter' && this.gameActive) {
                        this.submitGuess();
                    }
                });

                this.elements.guessInput.addEventListener('input', (event) => {
                    this.validateInput(event);
                });

                // Prevent form submission
                this.elements.guessInput.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                    }
                });

                // Window event listeners
                window.addEventListener('beforeunload', () => {
                    this.saveGameData();
                });

                // Visibility change (pause when tab not active)
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden && this.gameActive) {
                        this.pauseTimer();
                    } else if (!document.hidden && this.gameActive) {
                        this.resumeTimer();
                    }
                });

                console.log('🔧 Event listeners bound successfully');
            }