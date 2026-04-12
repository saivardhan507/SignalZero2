import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import nodemailer from 'nodemailer';

// ─── Health Check ──────────────────────────────────────────────────
async function handleHealth() {
  // Verify Supabase connection
  const { error } = await supabase.from('leads').select('id').limit(1);
  return NextResponse.json({
    status: error ? 'degraded' : 'ok',
    service: 'Signal Zero API',
    database: error ? 'supabase:error' : 'supabase:connected',
    timestamp: new Date().toISOString(),
  });
}

// ─── Email Template ────────────────────────────────────────────────
function generateEmailTemplate(data) {
  const serviceLabels = {
    fullstack: 'Full-Stack Web Platform',
    ai: 'Custom AI Agent / RAG Pipeline',
    '3d': '3D Modeling & WebGL',
    fintech: 'FinTech & Algorithmic Dashboards',
    data: 'Data Engineering & ETL',
    automation: 'Cognitive Workflow Automation',
  };
  const services = (data.services || []).map(s => serviceLabels[s] || s).join(', ');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; padding: 0; color: #e2e8f0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #0a0a0f; border: 1px solid rgba(0, 240, 255, 0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .header { padding: 50px 40px; text-align: center; background: linear-gradient(180deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 0, 0, 0) 100%); }
        .logo-text { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #00f0ff; margin-bottom: 8px; text-transform: uppercase; }
        .tagline { font-size: 11px; letter-spacing: 3px; color: #64748b; text-transform: uppercase; font-weight: 600; }
        .content { padding: 0 40px 40px; }
        .greeting { font-size: 24px; font-weight: 700; color: #f8fafc; margin-bottom: 20px; }
        .message { font-size: 16px; line-height: 1.7; color: #94a3b8; margin-bottom: 30px; }
        .card { background: rgba(0, 240, 255, 0.03); border: 1px solid rgba(0, 240, 255, 0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px; }
        .card-title { font-size: 13px; font-weight: 700; color: #00f0ff; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; border-bottom: 1px solid rgba(0, 240, 255, 0.1); padding-bottom: 10px; }
        .info-row { display: flex; margin-bottom: 12px; font-size: 14px; }
        .info-label { color: #64748b; width: 100px; flex-shrink: 0; font-weight: 600; }
        .info-value { color: #cbd5e1; }
        .footer { padding: 40px; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center; }
        .footer-text { font-size: 12px; color: #475569; line-height: 1.5; }
        .highlight { color: #00f0ff; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo-text">SIGNAL ZERO</div>
          <div class="tagline">Integrated AI & Systems Engineering</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${data.full_name},</div>
          <div class="message">
            Thank you for reaching out to <span class="highlight">Signal Zero</span>. We have successfully received your project inquiry. Our specialized engineering team is currently analyzing your technical requirements.
            <br><br>
            You can expect a detailed response with tailored strategic insights within the next <span class="highlight">24 hours</span>.
          </div>
          
          <div class="card">
            <div class="card-title">Inquiry Details</div>
            <div class="info-row"><div class="info-label">Company:</div><div class="info-value">${data.company || 'Personal Project'}</div></div>
            <div class="info-row"><div class="info-label">Services:</div><div class="info-value">${services || 'Technical Consultation'}</div></div>
            <div class="info-row"><div class="info-label">Budget:</div><div class="info-value">${data.budget_tier || 'TBD'}</div></div>
            <div class="info-row"><div class="info-label">Timeline:</div><div class="info-value">${data.timeline || 'Flexible'}</div></div>
          </div>
        </div>
        <div class="footer">
          <div class="footer-text">
            &copy; ${new Date().getFullYear()} Signal Zero. All rights reserved<br>
            Premium AI, FinTech, and Data Solutions
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─── POST /api/leads ───────────────────────────────────────────────
async function handleCreateLead(request) {
  try {
    const body = await request.json();

    const lead = {
      id: uuidv4(),
      full_name: body.fullName || '',
      company: body.company || '',
      website: body.website || '',
      email: body.email || '',
      services: body.services || [],
      elevator_pitch: body.elevatorPitch || '',
      budget_tier: body.budgetTier || '',
      timeline: body.timeline || '',
      data_state: body.dataState || '',
      ai_readiness: body.aiReadiness || 5,
      email_sent: false,
    };

    // Insert into Supabase
    const { data, error } = await supabase.from('leads').insert(lead).select();

    if (error) {
      console.error('[Supabase] Insert lead error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Send confirmation email via Nodemailer (Gmail SMTP)
    if (body.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        const mailOptions = {
          from: `"Signal Zero" <${process.env.GMAIL_USER}>`,
          to: body.email,
          subject: 'Signal Zero - Inquiry Received',
          html: generateEmailTemplate(lead),
        };

        await transporter.sendMail(mailOptions);
        
        // Update email_sent flag in Supabase
        await supabase.from('leads').update({ email_sent: true }).eq('id', lead.id);
        lead.email_sent = true;
      } catch (emailError) {
        console.error('[Nodemailer] Email error:', emailError);
      }
    }

    return NextResponse.json({ success: true, lead: data?.[0] || lead });
  } catch (error) {
    console.error('[/api/leads] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── GET /api/leads ────────────────────────────────────────────────
async function handleGetLeads() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, leads: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ─── Route Handler ─────────────────────────────────────────────────
export async function GET(request, { params }) {
  const path = params?.path?.join('/') || '';
  if (path === 'health') return handleHealth();
  if (path === 'leads') return handleGetLeads();
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request, { params }) {
  const path = params?.path?.join('/') || '';
  if (path === 'leads') return handleCreateLead(request);
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
