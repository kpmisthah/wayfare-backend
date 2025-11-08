import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IAiModel } from 'src/domain/interfaces/aiModal.interface';

@Injectable()
export class AiModal implements IAiModel {
  private openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPEN_ROUTER_API,     
    timeout: 60000,
  });

  async askModal(prompt: string): Promise<string> {
    console.log(prompt,'promptttttt in askModaaaalll');
    
    const completion = await this.openai.chat.completions.create({
      model: 'nvidia/nemotron-nano-9b-v2:free',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI travel planner. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      // response_format: { type: 'json_object' },
    });
    console.log(completion,'complettionnnnn');
    
    const message = completion.choices?.[0].message?.content || '';
    console.log(message,'message');
    const jsonMatch = message.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Could not extract JSON from AI response:', message);
      return '{}';
    }
    return jsonMatch[0]
    
  }
}
