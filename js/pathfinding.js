/**
 * Thuật toán BFS tìm đường (Phiên bản nâng cấp: Hỗ trợ đi ra ngoài biên)
 */
function findPath(p1, p2, grid) {
    const rows = CONFIG.ROWS;
    const cols = CONFIG.COLS;

    // Hàng đợi: {r, c, hướng, số_lần_rẽ}
    let queue = [{r: p1.r, c: p1.c, dir: -1, turns: 0}];
    let visited = new Set(); 

    const directions = [
        {dr: -1, dc: 0, type: 1}, // Lên
        {dr: 1, dc: 0, type: 1},  // Xuống
        {dr: 0, dc: -1, type: 0}, // Trái
        {dr: 0, dc: 1, type: 0}   // Phải
    ];

    while (queue.length > 0) {
        let curr = queue.shift();

        // Kiểm tra đích đến
        if (curr.r === p2.r && curr.c === p2.c) return true;

        let key = `${curr.r},${curr.c},${curr.dir},${curr.turns}`;
        if (visited.has(key)) continue;
        visited.add(key);

        for (let d of directions) {
            let nr = curr.r + d.dr;
            let nc = curr.c + d.dc;

            // --- NÂNG CẤP QUAN TRỌNG Ở ĐÂY ---
            // Cho phép đi ra ngoài biên thêm 1 ô (tọa độ -1 hoặc bằng rows/cols)
            // Phạm vi hợp lệ: từ -1 đến rows (ví dụ 0..7 thì cho phép -1 và 8)
            if (nr >= -1 && nr <= rows && nc >= -1 && nc <= cols) {
                
                // Tính số lần rẽ
                let newTurns = curr.turns;
                if (curr.dir !== -1 && curr.dir !== d.type) {
                    newTurns++;
                }

                if (newTurns > 2) continue;

                // Kiểm tra xem ô tiếp theo có đi được không?
                let isWalkable = false;

                // Trường hợp 1: Ô nằm ngoài bàn cờ -> Luôn đi được (Biên ảo)
                if (nr === -1 || nr === rows || nc === -1 || nc === cols) {
                    isWalkable = true;
                } 
                // Trường hợp 2: Ô nằm trong bàn cờ
                else {
                    // Phải là ô trống (matched) HOẶC là ô đích
                    // Lưu ý: grid[nr][nc] chỉ truy cập được khi nằm trong phạm vi thật
                    let isTarget = (nr === p2.r && nc === p2.c);
                    let isEmpty = grid[nr][nc].matched;
                    if (isEmpty || isTarget) {
                        isWalkable = true;
                    }
                }

                if (isWalkable) {
                    queue.push({
                        r: nr, 
                        c: nc, 
                        dir: d.type, 
                        turns: newTurns
                    });
                }
            }
        }
    }
    return false;
}