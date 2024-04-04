// InputForm.tsx
import React from 'react';
import { Form, Col, Button } from 'react-bootstrap';

interface InputFormProps {
    repoUrl: string;
    loading: boolean;
    handleRepoUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleLoadIssues: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ repoUrl, loading, handleRepoUrlChange, handleLoadIssues }) => {
    return (
        <Form.Group as={Col} controlId="repoUrl">
            <Form.Label>Repository URL:</Form.Label>
            <Form.Control type="text" value={repoUrl} onChange={handleRepoUrlChange} />
            <Button onClick={handleLoadIssues} disabled={loading}>
                {loading ? 'Loading...' : 'Load'}
            </Button>
        </Form.Group>
    );
};

export default InputForm;
