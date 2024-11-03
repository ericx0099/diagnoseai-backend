import { Injectable, Logger } from '@nestjs/common';
import {
  Diagnosis,
  DiagnosisQuestions,
} from '../diagnosis/schema/diagnosis.schema';
import { Language } from '../languages/schema/language.schema';
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
    let questions = null;
    if (! (result.json.length > 1 )) {
      const diagnosisQuestions: string[] = result.json[0].split('\n');
      questions = diagnosisQuestions;
    } else {
      questions = result.json;
    }
    if (questions.length > 0 && Array.isArray(questions)) {
      if (questions[questions.length - 1].slice(-1) !== '?') {
       // questions = questions.pop();
      }
    }
    return questions;
  }
  async generateDiagnose(diagnosis: Diagnosis, lang: Language) {
    const endpoint = process.env.FLOWISE_DIAGNOSE_ENDPOINT;

    const initialSymptoms = {
      question: 'What are your symptoms?',
      answer: diagnosis.symptoms,
    };
    const languageQuestion = {
      question: "In what languge do you want the AI to generate text?",
      answer: lang.english_name
    };

    const formattedQuestions = diagnosis.questions.map(
      ({ question, answer }) => {
        return { question, answer };
      },
    );

    formattedQuestions.unshift(languageQuestion);
    formattedQuestions.unshift(initialSymptoms);

    const toReturn = {
      health_issue: '',
      problem_description: '',
      help_recomendations: '',
      flowise_chat_id: '',
      error: false,
      error_message: '',
      diagnosis_generated: true,
      diagnosis_generation_date: new Date(),
    };
    let textResult = '';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: JSON.stringify(formattedQuestions) }),
      });
      //const responseText = response;
      //  textResult = await responseText.text();
      const result = await response.json();

      Logger.debug(result);
      if (result.json) {
        const json = result.json;
        if (json.health_issue) {
          toReturn.health_issue = json.health_issue;
        }
        if (json.problem_description) {
          toReturn.problem_description = json.problem_description;
        }
        if (json.help_recomendations) {
          toReturn.help_recomendations = json.help_recomendations;
        }
      }
      if (result.chatId) {
        toReturn.flowise_chat_id = result.chatId;
      }
    } catch (err) {
      toReturn.error = true;
      Logger.debug(err);
      toReturn.error_message = textResult;
    }

    return toReturn;
  }
}
