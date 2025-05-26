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
              /**
             * Validate and format user input
             */
            validateInput(event) {
                const input = event.target;
                let value = input.value;

                // Remove non-alphabetic characters and convert to uppercase
                value = value.replace(/[^a-zA-Z]/g, '').toUpperCase();
                
                // Update input value
                input.value = value;

                // Enable/disable submit button based on input
                const hasValidInput = value.length > 0;
                this.elements.submitBtn.disabled = !hasValidInput || !this.gameActive;

                // Visual feedback for valid input
                if (hasValidInput && this.gameActive) {
                    input.classList.remove('shake');
                    this.elements.submitBtn.classList.add('glow');
                } else {
                    this.elements.submitBtn.classList.remove('glow');
                }
            }

            /**
             * Start a new game
             */
            startGame() {
                console.log('🚀 Starting new game...');
                
                // Reset game state
                this.resetGameState();
                
                // Update UI
                this.updateGameUI(true);
                
                // Start first word
                this.nextWord();
                
                // Update display
                this.updateDisplay();
                
                console.log('✅ Game started successfully!');
            }

            /**
             * Reset all game state variables
             */
            resetGameState() {
                this.gameActive = true;
                this.score = 0;
                this.correctCount = 0;
                this.currentStreak = 0;
                this.difficulty = 'easy';
                this.hintsUsed = 0;
                this.skipCount = 0;
                this.gameStats.totalGames++;
            }

            /**
             * Update UI elements for game start/end
             */
            updateGameUI(gameStarted) {
                if (gameStarted) {
                    // Show game controls
                    this.elements.startBtn.style.display = 'none';
                    this.elements.submitBtn.style.display = 'inline-block';
                    this.elements.hintBtn.style.display = 'inline-block';
                    this.elements.skipBtn.style.display = 'inline-block';
                    this.elements.restartBtn.style.display = 'inline-block';
                    
                    // Enable input
                    this.elements.guessInput.disabled = false;
                    this.elements.guessInput.focus();
                    
                    // Hide sections
                    this.hideSection(this.elements.gameOverSection);
                    this.hideSection(this.elements.feedbackSection);
                } else {
                    // Show start button
                    this.elements.startBtn.style.display = 'inline-block';
                    this.elements.submitBtn.style.display = 'none';
                    this.elements.hintBtn.style.display = 'none';
                    this.elements.skipBtn.style.display = 'none';
                    this.elements.restartBtn.style.display = 'none';
                    
                    // Disable input
                    this.elements.guessInput.disabled = true;
                    this.elements.guessInput.value = '';
                }
            }

            /**
             * Generate next word for the game
             */
            nextWord() {
                if (!this.gameActive) return;

                console.log(`📝 Generating next word (Difficulty: ${this.difficulty})`);

                // Update difficulty based on progress
                this.updateDifficulty();

                // Get word list for current difficulty
                const wordList = this.wordDatabase[this.difficulty];
                
                if (!wordList || wordList.length === 0) {
                    this.endGame('No words available for current difficulty');
                    return;
                }

                // Select random word
                const randomIndex = Math.floor(Math.random() * wordList.length);
                this.currentWord = wordList[randomIndex];
                
                // Generate scrambled version
                this.scrambledWord = this.scrambleWord(this.currentWord.word);
                
                // Ensure scrambled word is different from original
                let attempts = 0;
                while (this.scrambledWord === this.currentWord.word && attempts < 20) {
                    this.scrambledWord = this.scrambleWord(this.currentWord.word);
                    attempts++;
                }

                // Update display
                this.elements.scrambledWord.textContent = this.scrambledWord;
                this.elements.scrambledWord.classList.add('pulse');
                setTimeout(() => {
                    this.elements.scrambledWord.classList.remove('pulse');
                }, 2000);

                // Reset input and hide sections
                this.elements.guessInput.value = '';
                this.elements.guessInput.focus();
                this.hideSection(this.elements.hintSection);
                this.hideSection(this.elements.feedbackSection);
                
                // Reset word-specific variables
                this.hintsUsed = 0;
                this.elements.hintBtn.disabled = false;

                // Start timer
                this.startTimer();

                // Update stats
                this.gameStats.totalWordsAttempted++;

                console.log(`✅ New word ready: ${this.currentWord.word}`);
            }

            /**
             * Scramble letters in a word using Fisher-Yates algorithm
             */
            scrambleWord(word) {
                const letters = word.split('');
                
                // Fisher-Yates shuffle algorithm
                for (let i = letters.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [letters[i], letters[j]] = [letters[j], letters[i]];
                }
                
                return letters.join('');
            }

            /**
             * Update difficulty based on progress
             */
            updateDifficulty() {
                const previousDifficulty = this.difficulty;
                
                if (this.correctCount >= 10) {
                    this.difficulty = 'hard';
                } else if (this.correctCount >= 5) {
                    this.difficulty = 'medium';
                } else {
                    this.difficulty = 'easy';
                }

                // Notify user of difficulty change
                if (previousDifficulty !== this.difficulty) {
                    this.showFeedback(
                        `🎯 Difficulty increased to ${this.difficulty.toUpperCase()}!`,
                        'correct',
                        2000
                    );
                }
            };
