import { Injectable } from '@nitrostack/core';
import {
  AuthStatus,
  EmailAnalysisInput,
  EmailAnalysisResult,
  EvidenceItem,
  RiskLevel,
  RecommendedAction,
  SignalBreakdown,
  Severity,
} from './email-types';
import {
  BRAND_NAMES,
  AUTHORITY_REGEX,
  CREDENTIAL_REGEX,
  DEFAULT_MITIGATION,
  DANGEROUS_ATTACHMENT_REGEX,
  FINANCIAL_REGEX,
  GRAMMAR_REGEX,
  HOMOGLYPH_REGEX,
  HTTP_REGEX,
  IP_URL_REGEX,
  LOGIN_PATH_REGEX,
  MIME_FILENAME_MISMATCH_PATTERNS,
  SHORTENER_REGEX,
  SUSPICIOUS_TLD_REGEX,
  THREAT_REGEX,
  URGENCY_REGEX,
} from './email-rules';
import {
  extractDomain,
  extractUrlsFromText,
  normalizeText,
  uniqueStrings,
} from './email-normalizer';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getRiskLevel(score: number): RiskLevel {
  if (score <= 20) return 'safe';
  if (score <= 45) return 'low';
  if (score <= 70) return 'medium';
  if (score <= 90) return 'high';
  return 'critical';
}

function getRecommendedAction(score: number, evidence: EvidenceItem[]): RecommendedAction {
  const hasCritical = evidence.some((e) => e.severity === 'critical');
  if (score >= 91 || hasCritical) return 'block';
  if (score >= 71) return 'quarantine';
  if (score >= 46) return 'warn';
  return 'allow';
}

@Injectable()
export class EmailAnalysisService {
  scoreSenderAuth(auth?: {
    spf?: AuthStatus;
    dkim?: AuthStatus;
    dmarc?: AuthStatus;
  }): { score: number; evidence: EvidenceItem[] } {
    const evidence: EvidenceItem[] = [];
    let score = 0;

    if (auth?.spf === 'fail') {
      score += 20;
      evidence.push({ category: 'Authentication', signal: 'SPF failed', severity: 'high', weight: 20 });
    } else if (auth?.spf === 'softfail') {
      score += 10;
      evidence.push({ category: 'Authentication', signal: 'SPF softfail', severity: 'medium', weight: 10 });
    }

    if (auth?.dkim === 'fail') {
      score += 20;
      evidence.push({ category: 'Authentication', signal: 'DKIM failed', severity: 'high', weight: 20 });
    }

    if (auth?.dmarc === 'fail') {
      score += 25;
      evidence.push({ category: 'Authentication', signal: 'DMARC failed', severity: 'critical', weight: 25 });
    } else if (auth?.dmarc === 'none') {
      score += 8;
      evidence.push({ category: 'Authentication', signal: 'DMARC missing', severity: 'medium', weight: 8 });
    }

    return { score: clamp(score, 0, 40), evidence };
  }

  scoreSenderIdentity(input: {
    fromName?: string;
    fromEmail: string;
    replyTo?: string;
    subject?: string;
    bodyText: string;
  }): { score: number; evidence: EvidenceItem[] } {
    const evidence: EvidenceItem[] = [];
    let score = 0;

    const fromDomain = extractDomain(input.fromEmail);
    const replyToDomain = extractDomain(input.replyTo);
    const body = normalizeText(input.bodyText);
    const subject = normalizeText(input.subject || '');

    if (input.fromName) {
      for (const brand of BRAND_NAMES) {
        const brandRegex = new RegExp(`\\b${brand.replace(/\s+/g, '\\s+')}\\b`, 'i');
        if (brandRegex.test(input.fromName) && fromDomain && !fromDomain.includes(brand.replace(/\s+/g, ''))) {
          score += 18;
          evidence.push({
            category: 'Sender Identity',
            signal: `Display name spoofing: "${input.fromName}" from ${fromDomain}`,
            severity: 'high',
            weight: 18,
          });
          break;
        }
      }
    }

    if (replyToDomain && fromDomain && replyToDomain !== fromDomain) {
      score += 15;
      evidence.push({
        category: 'Sender Identity',
        signal: 'Reply-To mismatch',
        severity: 'high',
        weight: 15,
        details: `From domain ${fromDomain} differs from Reply-To domain ${replyToDomain}`,
      });
    }

    if (HOMOGLYPH_REGEX.test(input.fromEmail) || HOMOGLYPH_REGEX.test(input.fromName || '') || HOMOGLYPH_REGEX.test(subject) || HOMOGLYPH_REGEX.test(body)) {
      score += 12;
      evidence.push({
        category: 'Sender Identity',
        signal: 'Homoglyph / lookalike brand variant detected',
        severity: 'medium',
        weight: 12,
      });
    }

    return { score: clamp(score, 0, 35), evidence };
  }

  scoreBodyLanguage(bodyText: string): { score: number; evidence: EvidenceItem[] } {
    const evidence: EvidenceItem[] = [];
    let score = 0;

    if (URGENCY_REGEX.test(bodyText)) {
      score += 10;
      evidence.push({ category: 'Body Language', signal: 'Urgency language', severity: 'medium', weight: 10 });
    }

    if (THREAT_REGEX.test(bodyText)) {
      score += 12;
      evidence.push({ category: 'Body Language', signal: 'Threat / account lock language', severity: 'high', weight: 12 });
    }

    if (CREDENTIAL_REGEX.test(bodyText)) {
      score += 14;
      evidence.push({ category: 'Body Language', signal: 'Credential harvesting language', severity: 'high', weight: 14 });
    }

    if (FINANCIAL_REGEX.test(bodyText)) {
      score += 8;
      evidence.push({ category: 'Body Language', signal: 'Financial manipulation language', severity: 'medium', weight: 8 });
    }

    if (AUTHORITY_REGEX.test(bodyText)) {
      score += 7;
      evidence.push({ category: 'Body Language', signal: 'Authority impersonation language', severity: 'medium', weight: 7 });
    }

    if (GRAMMAR_REGEX.test(bodyText)) {
      score += 3;
      evidence.push({ category: 'Body Language', signal: 'Grammar/spelling anomalies', severity: 'low', weight: 3 });
    }

    return { score: clamp(score, 0, 30), evidence };
  }

  scoreUrls(urls: string[], bodyText: string): { score: number; evidence: EvidenceItem[] } {
    const evidence: EvidenceItem[] = [];
    let score = 0;
    const allUrls = uniqueStrings([...urls, ...extractUrlsFromText(bodyText)]);

    for (const url of allUrls) {
      const normalized = url.trim();

      if (HTTP_REGEX.test(normalized)) {
        score += 10;
        evidence.push({ category: 'URLs', signal: 'HTTP instead of HTTPS', severity: 'medium', weight: 10, details: normalized });
      }

      if (IP_URL_REGEX.test(normalized)) {
        score += 20;
        evidence.push({ category: 'URLs', signal: 'IP address used in URL', severity: 'high', weight: 20, details: normalized });
      }

      if (SHORTENER_REGEX.test(normalized)) {
        score += 15;
        evidence.push({ category: 'URLs', signal: 'URL shortener detected', severity: 'high', weight: 15, details: normalized });
      }

      if (SUSPICIOUS_TLD_REGEX.test(normalized)) {
        score += 15;
        evidence.push({ category: 'URLs', signal: 'Suspicious top-level domain', severity: 'high', weight: 15, details: normalized });
      }

      if (/xn--/i.test(normalized)) {
        score += 20;
        evidence.push({ category: 'URLs', signal: 'Punycode / internationalized domain detected', severity: 'high', weight: 20, details: normalized });
      }

      if ((normalized.match(/\./g) || []).length >= 4) {
        score += 8;
        evidence.push({ category: 'URLs', signal: 'Deep subdomain chain detected', severity: 'medium', weight: 8, details: normalized });
      }

      if (LOGIN_PATH_REGEX.test(normalized)) {
        score += 10;
        evidence.push({ category: 'URLs', signal: 'Credential / account action keyword in URL', severity: 'medium', weight: 10, details: normalized });
      }

      if (/redirect|return=|continue=|url=/i.test(normalized)) {
        score += 8;
        evidence.push({ category: 'URLs', signal: 'Redirect parameter detected', severity: 'medium', weight: 8, details: normalized });
      }
    }

    return { score: clamp(score, 0, 35), evidence };
  }

  scoreAttachments(attachments?: Array<{ filename: string; mimeType?: string; size?: number }>): { score: number; evidence: EvidenceItem[] } {
    const evidence: EvidenceItem[] = [];
    let score = 0;

    for (const attachment of attachments || []) {
      const filename = attachment.filename.toLowerCase();
      const mimeType = (attachment.mimeType || '').toLowerCase();

      if (DANGEROUS_ATTACHMENT_REGEX.test(filename)) {
        score += 20;
        evidence.push({
          category: 'Attachments',
          signal: `Dangerous attachment type: ${attachment.filename}`,
          severity: 'critical',
          weight: 20,
        });
      }

      if (/\.(pdf|docx?|xlsx?|pptx?|zip|rar|iso)\.exe$/i.test(filename)) {
        score += 25;
        evidence.push({
          category: 'Attachments',
          signal: `Double-extension attachment: ${attachment.filename}`,
          severity: 'critical',
          weight: 25,
        });
      }

      for (const rule of MIME_FILENAME_MISMATCH_PATTERNS) {
        if (rule.ext.test(filename) && rule.mime.test(mimeType)) {
          score += 12;
          evidence.push({
            category: 'Attachments',
            signal: rule.label,
            severity: 'high',
            weight: 12,
            details: `${attachment.filename} / ${attachment.mimeType || 'unknown MIME type'}`,
          });
          break;
        }
      }

      if (/\b(invoice|payment|urgent|secure|document|scan|copy|details)\b/i.test(filename)) {
        score += 5;
        evidence.push({
          category: 'Attachments',
          signal: 'Social-engineering filename',
          severity: 'low',
          weight: 5,
          details: attachment.filename,
        });
      }
    }

    return { score: clamp(score, 0, 25), evidence };
  }

  scoreBrandImpersonation(input: {
    subject?: string;
    bodyText: string;
    fromEmail: string;
    fromName?: string;
  }): { score: number; evidence: EvidenceItem[] } {
    const evidence: EvidenceItem[] = [];
    let score = 0;

    const fromDomain = extractDomain(input.fromEmail) || '';
    const body = normalizeText(input.bodyText);
    const subject = normalizeText(input.subject || '');
    const fromName = normalizeText(input.fromName || '');

    for (const brand of BRAND_NAMES) {
      const brandRegex = new RegExp(`\\b${brand.replace(/\s+/g, '\\s+')}\\b`, 'i');
      const brandFound = brandRegex.test(body) || brandRegex.test(subject) || brandRegex.test(fromName);

      if (brandFound && fromDomain && !fromDomain.includes(brand.replace(/\s+/g, ''))) {
        score += 15;
        evidence.push({
          category: 'Brand Impersonation',
          signal: `Brand mention without matching sender domain: ${brand}`,
          severity: 'high',
          weight: 15,
          details: `Sender domain: ${fromDomain}`,
        });
      }
    }

    return { score: clamp(score, 0, 20), evidence };
  }

  calibrateFinalScore(parts: SignalBreakdown): number {
    const weighted =
      parts.sender * 0.25 +
      parts.auth * 0.20 +
      parts.urls * 0.25 +
      parts.attachments * 0.15 +
      parts.body * 0.10 +
      parts.brand * 0.05 +
      parts.grammar * 0.05;

    return clamp(Math.round(weighted), 0, 100);
  }

  buildMitigation(evidence: EvidenceItem[]): string[] {
    const actions = new Set<string>();

    for (const item of evidence) {
      const signal = item.signal.toLowerCase();

      if (item.category === 'Authentication') {
        actions.add('Verify SPF, DKIM, and DMARC results for the sender domain');
        actions.add('Check whether the sender address and reply-to domain match');
      }

      if (item.category === 'URLs') {
        actions.add('Do not click suspicious links');
        actions.add('Inspect the destination domain before opening the URL');
      }

      if (item.category === 'Attachments') {
        actions.add('Do not open the attachment until verified');
        actions.add('Scan the attachment in an isolated sandbox');
      }

      if (item.category === 'Body Language') {
        actions.add('Verify requests for credentials or urgent actions through a trusted channel');
      }

      if (item.category === 'Brand Impersonation') {
        actions.add('Validate whether the sender is authorized to represent the brand');
      }

      if (signal.includes('credential')) {
        actions.add('Never share passwords, OTPs, or verification codes by email');
      }

      if (signal.includes('payment') || signal.includes('wire') || signal.includes('gift card')) {
        actions.add('Confirm any payment or transfer request with a second channel');
      }
    }

    if (actions.size === 0) {
      actions.add(DEFAULT_MITIGATION[0]);
    }

    return [...actions];
  }

  buildIndicators(evidence: EvidenceItem[]) {
    return evidence.map((item) => ({
      type: item.category,
      description: item.signal,
      severity: item.severity,
    }));
  }

  analyze(input: EmailAnalysisInput): EmailAnalysisResult {
    const fromDomain = extractDomain(input.from.domain || input.from.email);
    const replyToDomain = extractDomain(input.replyTo);
    const bodyText = input.bodyText || '';
    const urls = input.urls || extractUrlsFromText(bodyText);

    const authResult = this.scoreSenderAuth(input.auth);
    const senderIdentityResult = this.scoreSenderIdentity({
      fromName: input.from.name,
      fromEmail: input.from.email,
      replyTo: input.replyTo,
      subject: input.subject,
      bodyText,
    });
    const bodyResult = this.scoreBodyLanguage(bodyText);
    const urlResult = this.scoreUrls(urls, bodyText);
    const attachmentResult = this.scoreAttachments(input.attachments);
    const brandResult = this.scoreBrandImpersonation({
      subject: input.subject,
      bodyText,
      fromEmail: input.from.email,
      fromName: input.from.name,
    });

    const grammarScore = bodyResult.evidence.some((e) => e.signal === 'Grammar/spelling anomalies') ? 5 : 0;

    const signalBreakdown = {
      sender: senderIdentityResult.score,
      auth: authResult.score,
      body: bodyResult.score,
      urls: urlResult.score,
      attachments: attachmentResult.score,
      brand: brandResult.score,
      grammar: grammarScore,
    };

    const evidence = [
      ...authResult.evidence,
      ...senderIdentityResult.evidence,
      ...bodyResult.evidence,
      ...urlResult.evidence,
      ...attachmentResult.evidence,
      ...brandResult.evidence,
    ];

    const riskScore = this.calibrateFinalScore(signalBreakdown);
    const confidence = clamp(
      0.55 + evidence.length * 0.04 + (input.auth?.dmarc === 'pass' ? 0.03 : 0) - (input.auth?.dmarc === 'fail' ? 0.08 : 0),
      0.5,
      0.99
    );

    const riskLevel = getRiskLevel(riskScore);
    const recommendedAction = getRecommendedAction(riskScore, evidence);
    const mitigation = this.buildMitigation(evidence);
    const indicators = this.buildIndicators(evidence);

    return {
      riskScore,
      confidence: Math.round(confidence * 100) / 100,
      riskLevel,
      recommendedAction,
      evidence,
      signalBreakdown,
      indicators,
      mitigation,
      summary: `Email analysis complete. Risk score: ${riskScore}/100. Confidence: ${Math.round(confidence * 100)}%. Recommended action: ${recommendedAction}.`,
      senderDomain: fromDomain,
      replyToDomain,
      fromAddress: input.from.email,
      urls,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        mimeType: a.mimeType,
        risk: DANGEROUS_ATTACHMENT_REGEX.test(a.filename) ? 'high' : 'unknown',
      })),
      imageUrl: riskLevel === 'critical'
        ? 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    };
  }
}