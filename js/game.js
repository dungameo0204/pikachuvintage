class PikachuGame {
    constructor() {
        this.boardElement = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.messageElement = document.getElementById('message');
        
        this.grid = [];
        this.selectedCell = null;
        this.matchedCount = 0;
        this.score = 0;
        
        // Thiết lập CSS Grid động dựa trên số cột
        this.boardElement.style.gridTemplateColumns = `repeat(${CONFIG.COLS}, ${CONFIG.CELL_SIZE}px)`;
        this.boardElement.style.gridTemplateRows = `repeat(${CONFIG.ROWS}, ${CONFIG.CELL_SIZE}px)`;
    }

    start() {
        this.grid = [];
        this.selectedCell = null;
        this.matchedCount = 0;
        this.score = 0;
        this.updateUI();
        this.messageElement.innerText = "";
        this.boardElement.innerHTML = '';

        this.generateBoard();
    }

    generateBoard() {
        // 1. Tạo bộ bài (Deck)
        let deck = [];
        const totalPairs = (CONFIG.ROWS * CONFIG.COLS) / 2;
        const icons = THEMES.EMOJI;

        for (let i = 0; i < totalPairs; i++) {
            const icon = icons[i % icons.length];
            deck.push(icon, icon); // Thêm cặp
        }
        deck.sort(() => Math.random() - 0.5); // Xáo trộn

        // 2. Đổ vào lưới
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

                // Tạo phần tử DOM
                const el = document.createElement('div');
                el.classList.add('cell');
                el.innerText = cellData.icon;
                // Gắn sự kiện click
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
        if (cell.matched) return; // Bỏ qua ô đã ăn

        // Trường hợp 1: Bỏ chọn (Click lại ô đang chọn)
        if (this.selectedCell === cell) {
            this.deselect();
            return;
        }

        // Trường hợp 2: Đã có ô chọn trước đó -> Kiểm tra khớp
        if (this.selectedCell) {
            // Cùng hình ảnh
            if (this.selectedCell.icon === cell.icon) {
                // Kiểm tra đường đi (Gọi từ file pathfinding.js)
                const hasPath = findPath(this.selectedCell, cell, this.grid);
                
                if (hasPath) {
                    this.matchSuccess(this.selectedCell, cell);
                } else {
                    this.selectNew(cell); // Khác đường đi -> chọn ô mới
                }
            } else {
                this.selectNew(cell); // Khác hình -> chọn ô mới
            }
        } else {
            // Trường hợp 3: Chưa chọn ô nào
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
        // Hiệu ứng và Logic
        cell1.element.classList.remove('selected');
        cell1.matched = true;
        cell2.matched = true;
        
        cell1.element.classList.add('matched');
        cell2.element.classList.add('matched');

        this.selectedCell = null;
        this.matchedCount += 2;
        this.score += 100;
        this.updateUI();

        this.checkWin();
    }

    updateUI() {
        this.scoreElement.innerText = this.score;
    }

    checkWin() {
        if (this.matchedCount === CONFIG.ROWS * CONFIG.COLS) {
            this.messageElement.innerText = "🏆 CHIẾN THẮNG!";
        }
    }
}