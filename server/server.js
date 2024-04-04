import express from 'express';
const { default: fetch } = await import('node-fetch');
import cors from 'cors';
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.get('/api/issues', async (req, res) => {
    try {
        const response = await fetch('https://api.github.com/repos/holus-bolus/board-repo/issues', {
            headers: {
                Authorization: `token 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`
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch issues:', error);
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
