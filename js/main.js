// Khởi tạo đối tượng game toàn cục
const game = new PikachuGame();

// Hàm được gọi từ nút HTML
function startGame() {
    game.start();
}

// Tự động chạy khi mở trang
window.onload = () => {
    game.start();
};