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
        //Sometimes FLOWISE doesnt return an array as expected.
        if (result.json.length == 1) {
            const diagnosisQuestions: string[] = result.json[0].split("\n");
            if(diagnosisQuestions.length > result.json.length){
                return diagnosisQuestions;
            }
            return result.json;
        } else {
            return result.json;
        }
    }
    
}
