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
            }
             /**
             * Start the countdown timer
             */
            startTimer() {
                this.timeLeft = 30;
                this.updateTimerDisplay();
                
                this.timer = setInterval(() => {
                    this.timeLeft--;
                    this.updateTimerDisplay();
                    
                    if (this.timeLeft <= 0) {
                        this.handleTimeUp();
                    }
                }, 1000);
            }

            /**
             * Update timer display and progress bar
             */
            updateTimerDisplay() {
                this.elements.timer.textContent = `⏱️ Time: ${this.timeLeft}s`;
                
                const progressPercentage = (this.timeLeft / 30) * 100;
                this.elements.progressFill.style.width = `${progressPercentage}%`;
                
                // Change colors based on time remaining
                if (this.timeLeft <= 5) {
                    this.elements.progressFill.style.background = 'linear-gradient(135deg, #e53e3e, #c53030)';
                    this.elements.timer.classList.add('pulse');
                } else if (this.timeLeft <= 10) {
                    this.elements.progressFill.style.background = 'linear-gradient(135deg, #ed8936, #dd6b20)';
                    this.elements.timer.classList.add('pulse');
                } else {
                    this.elements.progressFill.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                    this.elements.timer.classList.remove('pulse');
                }
            }

            /**
             * Handle timer expiration
             */
            handleTimeUp() {
                console.log('⏰ Time is up!');
                
                this.clearTimer();
                this.currentStreak = 0;
                
                this.showFeedback(
                    `⏰ Time's up! The word was: ${this.currentWord.word}`,
                    'incorrect',
                    3000
                );

                setTimeout(() => {
                    this.nextWord();
                }, 3000);
            }

            /**
             * Clear the active timer
             */
            clearTimer() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }

            /**
             * Pause timer (when tab becomes inactive)
             */
            pauseTimer() {
                this.clearTimer();
                console.log('⏸️ Timer paused');
            }

            /**
             * Resume timer (when tab becomes active)
             */
            resumeTimer() {
                if (this.gameActive && this.timeLeft > 0) {
                    this.startTimer();
                    console.log('▶️ Timer resumed');
                }
            }

            /**
             * Submit and validate user's guess
             */
            submitGuess() {
                if (!this.gameActive || !this.currentWord) {
                    return;
                }

                const guess = this.elements.guessInput.value.trim().toUpperCase();
                console.log(`🎯 User guess: "${guess}" | Correct answer: "${this.currentWord.word}"`);

                // Validate input
                if (!this.isValidGuess(guess)) {
                    this.handleInvalidInput();
                    return;
                }

                // Clear timer
                this.clearTimer();

                // Check if guess is correct
                if (guess === this.currentWord.word) {
                    this.handleCorrectGuess();
                } else {
                    this.handleIncorrectGuess();
                }
            }

            /**
             * Validate if guess meets requirements
             */
            isValidGuess(guess) {
                return guess.length > 0 && /^[A-Z]+$/.test(guess);
            }

            /**
             * Handle invalid input with feedback
             */
            handleInvalidInput() {
                console.log('❌ Invalid input detected');
                
                this.elements.guessInput.classList.add('shake');
                this.showFeedback('Please enter a valid word (letters only)', 'incorrect', 2000);
                
                setTimeout(() => {
                    this.elements.guessInput.classList.remove('shake');
                    this.elements.guessInput.focus();
                }, 500);
            }

            /**
             * Handle correct guess with scoring and feedback
             */
            handleCorrectGuess() {
                console.log('✅ Correct guess!');
                
                // Calculate score with bonuses
                const points = this.calculateScore();
                
                // Update game state
                this.score += points;
                this.correctCount++;
                this.currentStreak++;
                this.bestStreak = Math.max(this.bestStreak, this.currentStreak);

                // Show success feedback
                this.showFeedback(
                    `🎉 Correct! +${points} points (Streak: ${this.currentStreak})`,
                    'correct',
                    2000
                );

                // Add visual celebration
                this.elements.scrambledWord.classList.add('pulse');
                this.elements.score.classList.add('glow');
                
                setTimeout(() => {
                    this.elements.scrambledWord.classList.remove('pulse');
                    this.elements.score.classList.remove('glow');
                    this.nextWord();
                }, 2000);

                console.log(`📊 Score: ${this.score}, Streak: ${this.currentStreak}`);
            }

            /**
             * Calculate score based on various factors
             */
            calculateScore() {
                const basePoints = 10;
                const timeBonus = Math.floor(this.timeLeft / 3); // 0-10 bonus points
                const streakBonus = Math.min(this.currentStreak * 2, 20); // Max 20 bonus
                const difficultyBonus = this.getDifficultyMultiplier();
                const hintPenalty = this.hintsUsed * 3; // 3 points per hint used
                
                const totalPoints = Math.max(
                    (basePoints + timeBonus + streakBonus) * difficultyBonus - hintPenalty,
                    5 // Minimum 5 points
                );

                console.log(`🧮 Score calculation: Base(${basePoints}) + Time(${timeBonus}) + Streak(${streakBonus}) × Difficulty(${difficultyBonus}) - Hints(${hintPenalty}) = ${totalPoints}`);
                
                return Math.floor(totalPoints);
            }

            /**
             * Get difficulty multiplier for scoring
             */
            getDifficultyMultiplier() {
                switch (this.difficulty) {
                    case 'easy': return 1.0;
                    case 'medium': return 1.5;
                    case 'hard': return 2.0;
                    default: return 1.0;
                }
            }

            /**
             * Handle incorrect guess with feedback
             */
            handleIncorrectGuess() {
                console.log('❌ Incorrect guess');
                
                // Reset streak
                this.currentStreak = 0;
                
                // Show feedback
                this.showFeedback(
                    `❌ Incorrect! The word was: ${this.currentWord.word}`,
                    'incorrect',
                    3000
                );

                // Visual feedback
                this.elements.guessInput.classList.add('shake');
                setTimeout(() => {
                    this.elements.guessInput.classList.remove('shake');
                }, 500);

                // Move to next word after delay
                setTimeout(() => {
                    this.nextWord();
                }, 3000);
            }

            /**
             * Show hint for current word
             */
            showHint() {
                if (!this.gameActive || !this.currentWord) {
                    return;
                }

                console.log('💡 Showing hint');
                
                // Increment hints used
                this.hintsUsed++;
                
                // Display hint
                this.elements.hintText.textContent = this.currentWord.hint;
                this.showSection(this.elements.hintSection);
                
                // Disable hint button to prevent multiple uses
                this.elements.hintBtn.disabled = true;
                this.elements.hintBtn.textContent = `Hint Used (${this.hintsUsed})`;
            }

            /**
             * Skip current word
             */
            skipWord() {
                if (!this.gameActive || !this.currentWord) {
                    return;
                }

                console.log('⏭️ Skipping word');
                
                // Clear timer and reset streak
                this.clearTimer();
                this.currentStreak = 0;
                this.skipCount++;
                
                // Show feedback
                this.showFeedback(
                    `⏭️ Skipped! The word was: ${this.currentWord.word}`,
                    'incorrect',
                    2000
                );

                // Move to next word
                setTimeout(() => {
                    this.nextWord();
                }, 2000);
            }

            /**
             * Restart the current game
             */
            restartGame() {
                console.log('🔄 Restarting game');
                
                this.endGame('Game restarted');
                
                setTimeout(() => {
                    this.startGame();
                }, 1000);
            }

               /**
             * End the current game
             */
            endGame(reason = 'Game ended') {
                console.log(`🏁 Game ended: ${reason}`);
                
                // Deactivate game
                this.gameActive = false;
                this.clearTimer();
                
                // Update final statistics
                this.updateFinalStats();
                
                // Save game data
                this.saveGameData();
                
                // Update UI
                this.updateGameUI(false);
                
                // Show game over section
                this.showGameOverScreen(reason);
                
                console.log(`📊 Final Score: ${this.score}, Words Solved: ${this.correctCount}`);
            }

            /**
             * Update final game statistics
             */
            updateFinalStats() {
                this.elements.finalScore.textContent = this.score;
                this.elements.finalCorrect.textContent = this.correctCount;
                this.elements.finalStreak.textContent = this.bestStreak;
                
                // Update averages
                this.gameStats.averageScore = Math.floor(
                    ((this.gameStats.averageScore * (this.gameStats.totalGames - 1)) + this.score) / 
                    this.gameStats.totalGames
                );
            }

            /**
             * Show game over screen with animations
             */
            showGameOverScreen(reason) {
                this.showSection(this.elements.gameOverSection);
                
                // Add celebration animation for high scores
                if (this.score > 100) {
                    this.elements.gameOverSection.classList.add('pulse');
                    setTimeout(() => {
                        this.elements.gameOverSection.classList.remove('pulse');
                    }, 3000);
                }
            }

            /**
             * Show feedback message with specified type and duration
             */
            showFeedback(message, type = 'correct', duration = 2000) {
                this.elements.feedbackMessage.textContent = message;
                this.elements.feedbackMessage.className = `feedback-message ${type}`;
                this.showSection(this.elements.feedbackSection);

                // Auto-hide after duration
                setTimeout(() => {
                    this.hideSection(this.elements.feedbackSection);
                }, duration);
            }

            /**
             * Show a section with animation
             */
            showSection(element) {
                element.style.display = 'block';
                element.classList.remove('hidden');
            }

            /**
             * Hide a section
             */
            hideSection(element) {
                element.style.display = 'none';
                element.classList.add('hidden');
            }

            /**
             * Update all display elements
             */
            updateDisplay() {
                // Update statistics
                this.elements.score.textContent = this.score;
                this.elements.correctCount.textContent = this.correctCount;
                this.elements.streak.textContent = this.currentStreak;
                
                // Update difficulty display
                const difficultyText = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
                this.elements.difficulty.textContent = `Difficulty: ${difficultyText}`;
                
                // Update button states
                this.elements.submitBtn.disabled = !this.gameActive || this.elements.guessInput.value.length === 0;
                this.elements.hintBtn.disabled = !this.gameActive || this.hintsUsed > 0;
                this.elements.skipBtn.disabled = !this.gameActive;

                // Reset hint button text
                this.elements.hintBtn.textContent = this.hintsUsed > 0 ? `Hint Used (${this.hintsUsed})` : 'Get Hint';
            }

            /**
             * Load saved game data from localStorage
             */
            loadGameData() {
                try {
                    const savedStats = localStorage.getItem('wordScrambleStats');
                    if (savedStats) {
                        const stats = JSON.parse(savedStats);
                        this.gameStats = { ...this.gameStats, ...stats };
                        console.log('📊 Game statistics loaded');
                    }
                    
                    this.loadLeaderboard();
                } catch (error) {
                    console.error('❌ Error loading game data:', error);
                }
            }

            /**
             * Save game data to localStorage
             */
            saveGameData() {
                try {
                    // Save statistics
                    localStorage.setItem('wordScrambleStats', JSON.stringify(this.gameStats));
                    
                    // Save to leaderboard if score is worthy
                    if (this.score > 0) {
                        this.saveToLeaderboard();
                    }
                    
                    console.log('💾 Game data saved');
                } catch (error) {
                    console.error('❌ Error saving game data:', error);
                }
            }

            /**
             * Save current game to leaderboard
             */
            saveToLeaderboard() {
                try {
                    let leaderboard = JSON.parse(localStorage.getItem('wordScrambleLeaderboard') || '[]');
                    
                    const gameEntry = {
                        score: this.score,
                        correctAnswers: this.correctCount,
                        bestStreak: this.bestStreak,
                        difficulty: this.difficulty,
                        date: new Date().toLocaleDateString(),
                        timestamp: Date.now()
                    };

                    leaderboard.push(gameEntry);
                    leaderboard.sort((a, b) => b.score - a.score);
                    leaderboard = leaderboard.slice(0, 10); // Keep top 10

                    localStorage.setItem('wordScrambleLeaderboard', JSON.stringify(leaderboard));
                    this.loadLeaderboard();
                    
                    console.log('🏆 Score saved to leaderboard');
                } catch (error) {
                    console.error('❌ Error saving to leaderboard:', error);
                }
            }

            /**
             * Load and display leaderboard
             */
            loadLeaderboard() {
                try {
                    const leaderboard = JSON.parse(localStorage.getItem('wordScrambleLeaderboard') || '[]');
                    
                    if (leaderboard.length === 0) {
                        this.elements.leaderboardList.innerHTML = 
                            '<p class="no-scores">No scores yet. Start playing to set a record!</p>';
                        return;
                    }

                    const leaderboardHTML = leaderboard
                        .map((entry, index) => `
                            <div class="leaderboard-entry">
                                <span>${index + 1}. ${entry.score} points</span>
                                <span>${entry.correctAnswers} correct | ${entry.date}</span>
                            </div>
                        `).join('');

                    this.elements.leaderboardList.innerHTML = leaderboardHTML;
                    
                    console.log('🏆 Leaderboard loaded');
                } catch (error) {
                    console.error('❌ Error loading leaderboard:', error);
                }
            }
        }

        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('🚨 Global error:', event.error);
            alert('An error occurred. Please refresh the page and try again.');
        });

        // Initialize game when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            console.log('🌟 DOM loaded, initializing Word Scramble Game...');
            
            try {
                window.wordScrambleGame = new WordScrambleGame();
                console.log('🎮 Game ready to play!');
            } catch (error) {
                console.error('❌ Failed to initialize game:', error);
                alert('Failed to initialize the game. Please refresh the page.');
            }
        });
    