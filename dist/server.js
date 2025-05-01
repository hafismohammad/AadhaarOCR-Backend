"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
const corsOptions = {
    origin: [
        'https://aadhaar-llh0du93e-hafis-mohammads-projects.vercel.app',
        'http://localhost:5173'
    ],
    credentials: true,
};
const PORT = process.env.PORT || 4002;
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
console.log('hit');
app.use('/', userRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
