import { ToolDecorator as Tool, z, ExecutionContext, Widget } from '@nitrostack/core';

/**
 * File Risk Analyzer Tools
 *
 * Analyze file hashes, types, and predict malware behavior
 */

export class FileRiskAnalyzerTools {
  @Widget({ route: 'file-risk-analyzer' })
  @Tool({
    name: 'analyze_file_risk',
    description: 'Analyze file hash, type, size, and predict malware behavior and risk',
    inputSchema: z.object({
      filename: z.string().describe('File name'),
      hash: z.string().optional().describe('File hash (MD5, SHA1, or SHA256)'),
      fileSize: z.number().optional().describe('File size in bytes'),
      fileType: z.string().optional().describe('File MIME type or extension'),
    }),
  })
  async analyzeFileRisk(
    input: { filename: string; hash?: string; fileSize?: number; fileType?: string },
    context: ExecutionContext
  ) {
    const { filename, hash, fileSize, fileType } = input;

    context.logger.info('Analyzing file risk', { filename, hash });

    let riskScore = 0;
    const indicators: string[] = [];
    const recommendations: string[] = [];

    // 1. File Type Analysis
    const typeResult = this.analyzeFileType(filename, fileType);
    riskScore += typeResult.score;
    indicators.push(...typeResult.indicators);

    // 2. File Size Analysis
    if (fileSize) {
      const sizeResult = this.analyzeFileSize(fileSize);
      riskScore += sizeResult.score;
      indicators.push(...sizeResult.indicators);
    }

    // 3. Hash Reputation
    if (hash) {
      const hashResult = this.analyzeHashReputation(hash);
      riskScore += hashResult.score;
      indicators.push(...hashResult.indicators);
    }

    // 4. Behavior Prediction
    const behaviorResult = this.predictBehavior(filename, fileType);
    riskScore += behaviorResult.score;
    indicators.push(...behaviorResult.indicators);
    recommendations.push(...behaviorResult.recommendations);

    riskScore = Math.min(Math.max(riskScore, 0), 100);
    const riskLevel = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

    return {
      filename,
      riskScore,
      riskLevel,
      indicators,
      recommendations,
      fileInfo: {
        hash,
        fileSize,
        fileType: fileType || this.detectFileType(filename),
      },
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
    };
  }

  private analyzeFileType(filename: string, fileType?: string) {
    let score = 0;
    const indicators: string[] = [];

    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const type = fileType || this.detectFileType(filename);

    // Dangerous executable types
    const dangerousExts = ['exe', 'bat', 'cmd', 'scr', 'vbs', 'js', 'jar', 'com', 'pif', 'msi'];
    if (dangerousExts.includes(ext)) {
      score += 30;
      indicators.push(`🚨 Dangerous executable type: .${ext}`);
    }

    // Macro-enabled documents
    const macroExts = ['doc', 'xls', 'ppt', 'docm', 'xlsm', 'pptm'];
    if (macroExts.includes(ext)) {
      score += 20;
      indicators.push(`⚠️ Macro-enabled document: .${ext}`);
    }

    // Archive files
    const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
    if (archiveExts.includes(ext)) {
      score += 10;
      indicators.push(`ℹ️ Archive file: .${ext}`);
    }

    // Safe types
    const safeExts = ['pdf', 'txt', 'jpg', 'png', 'gif', 'mp3', 'mp4'];
    if (safeExts.includes(ext)) {
      indicators.push(`✓ Safe file type: .${ext}`);
    }

    return { score, indicators };
  }

  private analyzeFileSize(fileSize: number) {
    let score = 0;
    const indicators: string[] = [];

    const sizeMB = fileSize / (1024 * 1024);

    if (fileSize === 0) {
      score += 15;
      indicators.push('⚠️ Empty file');
    } else if (sizeMB > 100) {
      score += 10;
      indicators.push(`⚠️ Large file (${sizeMB.toFixed(1)}MB)`);
    } else if (sizeMB < 0.01) {
      score += 5;
      indicators.push(`ℹ️ Very small file (${(fileSize / 1024).toFixed(1)}KB)`);
    } else {
      indicators.push(`ℹ️ File size: ${sizeMB.toFixed(1)}MB`);
    }

    return { score, indicators };
  }

  private analyzeHashReputation(hash: string) {
    let score = 0;
    const indicators: string[] = [];

    // Simulate hash reputation lookup
    const reputationDb: Record<string, { score: number; reputation: string }> = {
      'd41d8cd98f00b204e9800998ecf8427e': { score: 85, reputation: 'malicious' },
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': { score: 70, reputation: 'suspicious' },
    };

    const reputation = reputationDb[hash];
    if (reputation) {
      score = reputation.score;
      if (reputation.reputation === 'malicious') {
        indicators.push('🚨 Hash detected as malware');
      } else {
        indicators.push('⚠️ Hash flagged as suspicious');
      }
    } else {
      indicators.push('✓ Hash not found in malware databases');
    }

    return { score, indicators };
  }

  private predictBehavior(filename: string, fileType?: string) {
    let score = 0;
    const indicators: string[] = [];
    const recommendations: string[] = [];

    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const name = filename.toLowerCase();

    // Suspicious naming patterns
    if (/invoice|receipt|payment|urgent|confirm|verify|update|security/i.test(name)) {
      score += 15;
      indicators.push('⚠️ Suspicious filename pattern');
      recommendations.push('Verify file origin before opening');
    }

    // Double extension
    if (name.match(/\.\w+\.\w+$/)) {
      score += 20;
      indicators.push('🚨 Double extension detected');
      recommendations.push('Do not open - likely malware disguise');
    }

    // Behavior predictions
    if (['exe', 'bat', 'cmd', 'scr'].includes(ext)) {
      indicators.push('🚨 Likely to execute code');
      recommendations.push('Quarantine immediately');
    } else if (['doc', 'xls', 'ppt'].includes(ext)) {
      indicators.push('⚠️ May contain macros');
      recommendations.push('Disable macros before opening');
    } else if (['zip', 'rar'].includes(ext)) {
      indicators.push('ℹ️ May contain multiple files');
      recommendations.push('Scan contents before extraction');
    }

    return { score, indicators, recommendations };
  }

  private detectFileType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || 'unknown';
    const mimeTypes: Record<string, string> = {
      exe: 'application/x-msdownload',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      zip: 'application/zip',
      jpg: 'image/jpeg',
      png: 'image/png',
      txt: 'text/plain',
    };

    return mimeTypes[ext] || `application/${ext}`;
  }
}
