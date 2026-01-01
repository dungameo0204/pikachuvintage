class PikachuGame {
    constructor() {
        // Lấy các phần tử giao diện
        this.boardElement = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.timeBar = document.getElementById('time-bar');
        
        // Modal Game Over
        this.modal = document.getElementById('game-over-modal');
        this.finalScoreEl = document.getElementById('final-score');
        this.finalLevelEl = document.getElementById('final-level');
        this.modalTitle = document.getElementById('modal-title');

        // Biến trạng thái game
        this.grid = [];
        this.selectedCell = null;
        this.matchedCount = 0;
        this.score = 0;
        this.level = 1;
        
        // Biến thời gian
        this.timerInterval = null;
        this.totalTime = CONFIG.BASE_TIME;
        this.currentTime = CONFIG.BASE_TIME;
        this.isGameOver = false;

        // CSS Grid
        this.boardElement.style.gridTemplateColumns = `repeat(${CONFIG.COLS}, 1fr)`;
        this.boardElement.style.gridTemplateRows = `repeat(${CONFIG.ROWS}, 1fr)`;
    }

    // Bắt đầu game mới từ đầu (Reset Level 1)
    start() {
        this.level = 1;
        this.score = 0;
        this.modal.classList.add('hidden'); // Ẩn bảng thua
        this.startLevel();
    }

    // Bắt đầu một màn chơi (Level)
    startLevel() {
        this.isGameOver = false;
        this.grid = [];
        this.selectedCell = null;
        this.matchedCount = 0;
        this.boardElement.innerHTML = '';
        
        // Cập nhật giao diện
        this.updateUI();
        
        // Tính toán thời gian cho level này: Càng lên cao thời gian càng ít
        // Công thức: Thời gian gốc - ((Level - 1) * Số giây giảm)
        let levelTime = CONFIG.BASE_TIME - ((this.level - 1) * CONFIG.TIME_DECREASE);
        // Không cho thời gian tụt quá thấp (ví dụ dưới 15s)
        this.totalTime = Math.max(levelTime, CONFIG.MIN_TIME);
        this.currentTime = this.totalTime;

        // Tạo bàn cờ và chạy đồng hồ
        this.generateBoard();
        this.startTimer();
    }

    startTimer() {
        // Xóa timer cũ nếu có để tránh chạy đè
        if (this.timerInterval) clearInterval(this.timerInterval);

        // Cập nhật thanh thời gian ngay lập tức
        this.updateTimeBar();

        this.timerInterval = setInterval(() => {
            this.currentTime--;
            this.updateTimeBar();

            if (this.currentTime <= 0) {
                this.gameOver();
            }
        }, 1000); // Chạy mỗi 1 giây
    }

    updateTimeBar() {
        const percentage = (this.currentTime / this.totalTime) * 100;
        this.timeBar.style.width = `${percentage}%`;

        // Đổi màu khi sắp hết giờ (dưới 30%)
        if (percentage < 30) {
            this.timeBar.style.backgroundColor = '#e74c3c'; // Màu đỏ
        } else {
            this.timeBar.style.backgroundColor = '#27ae60'; // Màu xanh
        }
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        
        // Hiện bảng Game Over
        this.modalTitle.innerText = "HẾT GIỜ!";
        this.modalTitle.style.color = "#e74c3c";
        this.finalScoreEl.innerText = this.score;
        this.finalLevelEl.innerText = this.level;
        this.modal.classList.remove('hidden');
    }

    generateBoard() {
        let deck = [];
        const totalPairs = (CONFIG.ROWS * CONFIG.COLS) / 2;
        const icons = THEMES.EMOJI;

        for (let i = 0; i < totalPairs; i++) {
            const icon = icons[i % icons.length];
            deck.push(icon, icon);
        }
        deck.sort(() => Math.random() - 0.5);

        let index = 0;
        for (let r = 0; r < CONFIG.ROWS; r++) {
            let row = [];
            for (let c = 0; c < CONFIG.COLS; c++) {
                let cellData = {
                    r: r, c: c,
                    icon: deck[index],
                    matched: false,
                    element: null
                };

                const el = document.createElement('div');
                el.classList.add('cell');
                el.innerText = cellData.icon;
                el.onclick = () => this.handleCellClick(cellData);

                cellData.element = el;
                this.boardElement.appendChild(el);
                row.push(cellData);
                index++;
            }
            this.grid.push(row);
        }
    }

    handleCellClick(cell) {
        if (this.isGameOver || cell.matched) return;

        if (this.selectedCell === cell) {
            this.deselect();
            return;
        }

        if (this.selectedCell) {
            if (this.selectedCell.icon === cell.icon) {
                // Gọi hàm tìm đường từ file pathfinding.js
                const hasPath = findPath(this.selectedCell, cell, this.grid);
                
                if (hasPath) {
                    this.matchSuccess(this.selectedCell, cell);
                } else {
                    this.selectNew(cell);
                }
            } else {
                this.selectNew(cell);
            }
        } else {
            this.selectNew(cell);
        }
    }

    selectNew(cell) {
        if (this.selectedCell) this.selectedCell.element.classList.remove('selected');
        this.selectedCell = cell;
        this.selectedCell.element.classList.add('selected');
    }

    deselect() {
        if (this.selectedCell) this.selectedCell.element.classList.remove('selected');
        this.selectedCell = null;
    }

    matchSuccess(cell1, cell2) {
        cell1.element.classList.remove('selected');
        cell1.matched = true;
        cell2.matched = true;
        
        cell1.element.classList.add('matched');
        cell2.element.classList.add('matched');

        this.selectedCell = null;
        this.matchedCount += 2;
        this.score += CONFIG.SCORE_PER_MATCH;
        this.updateUI();

        // Kiểm tra xem đã hết bàn cờ chưa
        if (this.matchedCount === CONFIG.ROWS * CONFIG.COLS) {
            this.levelComplete();
        }
    }

    levelComplete() {
        clearInterval(this.timerInterval); // Dừng đồng hồ
        this.score += CONFIG.SCORE_PER_LEVEL; // Thưởng điểm qua màn
        
        setTimeout(() => {
            alert(`Chúc mừng! Bạn đã qua Level ${this.level}`);
            this.level++; // Tăng level
            this.startLevel(); // Bắt đầu màn mới
        }, 300);
    }

    updateUI() {
        this.scoreElement.innerText = this.score;
        this.levelElement.innerText = this.level;
    }
}