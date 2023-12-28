import { ClientOptions, OpenAI } from 'openai';
import { ConditionalSingleton } from '../utils/conditional-singleton';

const OPEN_AI_KEY = process.env.OPEN_AI_KEY

const options: ClientOptions = {
    apiKey: OPEN_AI_KEY!
}

export const openAi = ConditionalSingleton<OpenAI>(OpenAI, [options])