import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { spawnSync } from 'child_process';
import { supabase } from '@/lib/supabase';

// ─── System Prompt ─────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Signal Zero's AI assistant. You help potential clients learn about Signal Zero's services, process, and expertise. Be professional, friendly, and concise.

About Signal Zero:
Signal Zero is a premium AI and Data engineering agency founded by Eppa Sai Vardhan Reddy. We specialize in building cutting-edge technology solutions.

Our Services:
1. Full-Stack Web Platform Development - Custom web apps with modern architectures using Next.js, React, Node.js, PostgreSQL, MongoDB
2. Custom AI Agent / RAG Pipeline - Intelligent AI agents trained on your data, conversational AI, document Q&A systems
3. 3D Modeling & WebGL - Interactive 3D experiences, product visualizations, immersive web applications
4. FinTech & Algorithmic Dashboards - Trading dashboards, financial analytics, algorithmic trading systems
5. Data Engineering & ETL - Data pipelines, warehouse design, real-time streaming, data quality frameworks
6. Cognitive Workflow Automation - AI-powered process automation, intelligent document processing

Budget Tiers:
- Under $5k: Consulting & Strategy sessions only
- $5k-$10k: Single module or feature development
- $10k-$25k: Full project development
- $25k+: Enterprise-grade, multi-phase solutions

Our Process: Discovery → Development → Deployment

Tech Stack: Python, TensorFlow, Keras, Scikit-learn, React/Next.js, Node.js, PostgreSQL, MongoDB, AWS, GCP, Power BI, Tableau

Founder Credentials:
- NASA Space Settlement Award winner (World 2nd Prize)
- Published AI researcher (IEEE ICOECA 2024)
- Experience with government AI projects (T-SAT, Govt of Telangana)
- B.Tech in CSE - Data Science

If a question is outside your knowledge, suggest they fill out the Project Discovery form on the website for a personalized consultation. Never make up information about pricing for specific projects - always direct them to the discovery form for custom quotes.`;

// ─── Strategy 1: @google/genai SDK ─────────────────────────────────
async function callGeminiDirect(message, history) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  const contents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.message }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: 800,
      temperature: 0.7,
    },
  });

  return response.text;
}

// ─── Strategy 2: Python Bridge ─────────────────────────────────────
function callGeminiBridge(message, history, sessionId) {
  const payload = JSON.stringify({
    message,
    session_id: sessionId,
    system_message: SYSTEM_PROMPT,
    history: history.map(h => ({ role: h.role, message: h.message })),
  });

  const result = spawnSync('/root/.venv/bin/python3', ['/app/scripts/chat_helper.py'], {
    input: payload,
    encoding: 'utf-8',
    timeout: 60000,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || 'Python bridge process failed');
  }

  const data = JSON.parse(result.stdout);
  if (!data.success) throw new Error(data.error || 'Bridge returned error');
  return data.response;
}

// ─── POST /api/chat ────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'message and sessionId are required' },
        { status: 400 }
      );
    }

    // Fetch conversation history from Supabase
    const { data: history, error: histError } = await supabase
      .from('chat_history')
      .select('role, message')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20);

    if (histError) {
      console.error('[Supabase] History fetch error:', histError);
    }

    const chatHistory = history || [];
    let responseText;

    // Primary: @google/genai SDK → Fallback: Python bridge
    try {
      responseText = await callGeminiDirect(message, chatHistory);
      console.log('[/api/chat] Response via @google/genai SDK');
    } catch (sdkError) {
      console.log('[/api/chat] @google/genai unavailable, using bridge:', sdkError.message?.substring(0, 100));
      responseText = callGeminiBridge(message, chatHistory, sessionId);
    }

    // Persist both messages to Supabase
    const { error: insertError } = await supabase.from('chat_history').insert([
      { id: uuidv4(), session_id: sessionId, role: 'user', message },
      { id: uuidv4(), session_id: sessionId, role: 'model', message: responseText },
    ]);

    if (insertError) {
      console.error('[Supabase] Chat history insert error:', insertError);
    }

    return NextResponse.json({ success: true, response: responseText });
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}
