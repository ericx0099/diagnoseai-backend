import { Injectable } from '@nestjs/common';
import { DiagnosisQuestions } from '../diagnosis/schema/diagnosis.schema';
import { v4 } from 'uuid';
@Injectable()
export class FlowiseService {
    async getQuestions(initialSymptoms: string): Promise<string[]> {
        const endpoint = process.env.FLOWISE_QUESTIONS_ENDPOINT!;
    
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: initialSymptoms }),
        });
        const result = await response.json();

        if (!(Array.isArray(result.json))) {
            const diagnosisQuestions: string[] = result.json.split("\n");
            return diagnosisQuestions;
        } else {
            return result.json;
        }
    }
    
}
