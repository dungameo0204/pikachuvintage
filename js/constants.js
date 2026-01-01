const CONFIG = {
    ROWS: 8,
    COLS: 8,
    CELL_SIZE: 50, // Vẫn giữ để tính toán trên PC, mobile dùng CSS đè
    
    // Cấu hình độ khó
    BASE_TIME: 60,      // Thời gian cơ bản (giây) cho Level 1
    TIME_DECREASE: 5,   // Mỗi level giảm 5 giây
    MIN_TIME: 15,       // Thời gian tối thiểu không được thấp hơn mức này
    SCORE_PER_MATCH: 100,
    SCORE_PER_LEVEL: 500
};

const THEMES = {
    EMOJI: ['🔥', '💧', '⚡', '🌿', '❄️', '👊', '🔮', '👻', '🐞', '🐲'],
};