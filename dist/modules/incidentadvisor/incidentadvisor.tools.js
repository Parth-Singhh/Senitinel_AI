var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, z, Widget } from '@nitrostack/core';
/**
 * Incident Advisor Tools
 *
 * Guided security incident triage and playbook suggestions
 */
export class IncidentAdvisorTools {
    async getIncidentGuidance(input, context) {
        const { incidentType, severity = 'high', affectedSystems = [] } = input;
        context.logger.info('Getting incident guidance', { incidentType, severity });
        const guidance = this.getPlaybook(incidentType, severity);
        return {
            incidentType,
            severity,
            affectedSystems,
            playbook: guidance.playbook,
            immediateActions: guidance.immediateActions,
            investigationSteps: guidance.investigationSteps,
            containmentSteps: guidance.containmentSteps,
            recoverySteps: guidance.recoverySteps,
            communicationTemplate: guidance.communicationTemplate,
            resources: guidance.resources,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
        };
    }
    getPlaybook(incidentType, severity) {
        const playbookDb = {
            phishing: {
                playbook: 'Phishing Incident Response Playbook',
                immediateActions: [
                    '🚨 Isolate affected user account immediately',
                    '📧 Preserve email evidence (do not delete)',
                    '🔐 Reset user credentials and enable MFA',
                    '📢 Alert security team and management',
                ],
                investigationSteps: [
                    '🔍 Analyze email headers and sender reputation',
                    '🔗 Check for malicious links/attachments',
                    '👥 Identify all recipients of phishing email',
                    '📊 Review user actions (clicks, downloads)',
                    '🌐 Check for credential harvesting attempts',
                ],
                containmentSteps: [
                    '🛑 Block sender domain/email address',
                    '⚠️ Add to email filter blocklist',
                    '🔔 Send security awareness alert to organization',
                    '🔐 Force password reset for affected users',
                    '📱 Enable additional authentication factors',
                ],
                recoverySteps: [
                    '✅ Verify no unauthorized access occurred',
                    '🔄 Restore normal email flow',
                    '📋 Document incident timeline',
                    '📚 Conduct post-incident review',
                ],
                communicationTemplate: `
Subject: Security Alert - Phishing Email Detected

A phishing email was detected targeting our organization. 
If you received this email, please:
1. Do NOT click any links or download attachments
2. Report it to security@company.com
3. Delete the email
4. Reset your password

For more info: [security portal link]
        `,
                resources: [
                    'NIST Phishing Response Guide',
                    'CISA Phishing Alert System',
                    'Email Security Best Practices',
                ],
            },
            malware: {
                playbook: 'Malware Incident Response Playbook',
                immediateActions: [
                    '🚨 Isolate infected system from network',
                    '📸 Capture system memory dump',
                    '🔐 Preserve evidence (do not reboot)',
                    '📢 Alert incident response team',
                ],
                investigationSteps: [
                    '🔍 Identify malware type and family',
                    '📊 Analyze process execution timeline',
                    '🌐 Check network connections and C2 servers',
                    '💾 Scan for persistence mechanisms',
                    '📁 Identify affected files and registry keys',
                ],
                containmentSteps: [
                    '🛑 Disconnect system from network',
                    '🔒 Block C2 domains at firewall',
                    '🔍 Scan all systems for similar indicators',
                    '⚠️ Update antivirus signatures',
                ],
                recoverySteps: [
                    '🔄 Rebuild system from clean backup',
                    '✅ Verify malware removal',
                    '🔐 Reset credentials for affected accounts',
                    '📋 Document IOCs for future detection',
                ],
                communicationTemplate: `
Subject: Security Incident - Malware Detected

A malware infection was detected on [system]. 
Immediate actions taken:
- System isolated from network
- Investigation in progress
- No user action required at this time

Updates will be provided as investigation progresses.
        `,
                resources: [
                    'MITRE ATT&CK Framework',
                    'VirusTotal Analysis',
                    'Malware Analysis Sandbox',
                ],
            },
            ransomware: {
                playbook: 'Ransomware Incident Response Playbook',
                immediateActions: [
                    '🚨 IMMEDIATELY isolate affected systems',
                    '🛑 Disconnect from network (unplug if necessary)',
                    '📸 Capture ransom note and system state',
                    '📞 Contact incident response team NOW',
                    '⚠️ DO NOT PAY RANSOM',
                ],
                investigationSteps: [
                    '🔍 Identify ransomware variant',
                    '📊 Determine infection vector',
                    '🌐 Check for lateral movement',
                    '💾 Identify backup systems affected',
                    '📁 Determine scope of encryption',
                ],
                containmentSteps: [
                    '🛑 Isolate all affected systems',
                    '🔒 Block C2 domains at firewall',
                    '🔍 Scan entire network for indicators',
                    '⚠️ Disable remote access services',
                    '🔐 Reset all credentials',
                ],
                recoverySteps: [
                    '✅ Restore from clean backups',
                    '🔄 Rebuild systems from scratch',
                    '🔐 Implement stronger access controls',
                    '📋 Document lessons learned',
                ],
                communicationTemplate: `
Subject: CRITICAL - Ransomware Incident

A ransomware attack has been detected. 
CRITICAL ACTIONS:
- All affected systems have been isolated
- DO NOT ATTEMPT TO DECRYPT FILES
- DO NOT PAY RANSOM
- Law enforcement has been notified

Incident response team is actively working on recovery.
        `,
                resources: [
                    'No More Ransom Project',
                    'CISA Ransomware Guidance',
                    'FBI IC3 Reporting',
                ],
            },
            data_breach: {
                playbook: 'Data Breach Incident Response Playbook',
                immediateActions: [
                    '🚨 Confirm data breach occurred',
                    '📸 Preserve evidence and logs',
                    '🔐 Secure affected systems',
                    '📢 Notify incident response team',
                    '⚖️ Consult legal/compliance',
                ],
                investigationSteps: [
                    '🔍 Identify what data was accessed',
                    '📊 Determine breach timeline',
                    '👥 Identify affected individuals',
                    '🌐 Trace attacker activity',
                    '💾 Identify root cause',
                ],
                containmentSteps: [
                    '🛑 Close unauthorized access',
                    '🔐 Reset credentials for affected accounts',
                    '⚠️ Implement additional monitoring',
                    '🔒 Patch vulnerabilities',
                ],
                recoverySteps: [
                    '✅ Verify breach is contained',
                    '📋 Prepare breach notification',
                    '📞 Notify affected individuals',
                    '📊 Conduct post-incident review',
                ],
                communicationTemplate: `
Subject: Important Security Notice - Data Breach

We are writing to inform you of a security incident affecting your data.
What happened: [description]
What data was affected: [list]
What we're doing: [actions]
What you should do: [recommendations]

For more information: [link]
        `,
                resources: [
                    'GDPR Breach Notification Requirements',
                    'State Breach Notification Laws',
                    'Credit Monitoring Services',
                ],
            },
            ddos: {
                playbook: 'DDoS Incident Response Playbook',
                immediateActions: [
                    '🚨 Confirm DDoS attack',
                    '📊 Analyze traffic patterns',
                    '🔐 Activate DDoS mitigation',
                    '📢 Alert infrastructure team',
                    '🌐 Contact ISP/CDN provider',
                ],
                investigationSteps: [
                    '🔍 Identify attack type (volumetric, protocol, application)',
                    '📊 Analyze source IPs and patterns',
                    '🌐 Check for botnet involvement',
                    '💾 Review attack timeline',
                ],
                containmentSteps: [
                    '🛑 Activate DDoS protection service',
                    '🔒 Rate limit suspicious traffic',
                    '⚠️ Implement geo-blocking if needed',
                    '🔄 Failover to backup infrastructure',
                ],
                recoverySteps: [
                    '✅ Verify service restoration',
                    '📋 Document attack details',
                    '🔍 Implement preventive measures',
                    '📊 Conduct post-incident review',
                ],
                communicationTemplate: `
Subject: Service Disruption - DDoS Attack

We experienced a DDoS attack that temporarily affected service availability.
Status: [current status]
Impact: [affected services]
Resolution: [actions taken]

We apologize for any inconvenience.
        `,
                resources: [
                    'NIST DDoS Mitigation Guide',
                    'Cloudflare DDoS Protection',
                    'AWS Shield Documentation',
                ],
            },
            account_compromise: {
                playbook: 'Account Compromise Incident Response Playbook',
                immediateActions: [
                    '🚨 Disable compromised account',
                    '🔐 Reset account credentials',
                    '📸 Preserve login history',
                    '📢 Alert account owner',
                    '🔍 Check for unauthorized actions',
                ],
                investigationSteps: [
                    '🔍 Review account access logs',
                    '📊 Identify unauthorized actions',
                    '🌐 Check for lateral movement',
                    '💾 Identify compromise vector',
                    '👥 Check for privilege escalation',
                ],
                containmentSteps: [
                    '🛑 Revoke active sessions',
                    '🔐 Reset all credentials',
                    '⚠️ Enable MFA',
                    '🔒 Review account permissions',
                ],
                recoverySteps: [
                    '✅ Restore account access',
                    '📋 Verify no persistence',
                    '🔐 Implement stronger controls',
                    '📊 Monitor for re-compromise',
                ],
                communicationTemplate: `
Subject: Account Security Alert

Your account was compromised. We have taken the following actions:
- Account disabled and secured
- Password reset required
- Session terminated

Please reset your password and enable MFA.
        `,
                resources: [
                    'NIST Account Recovery Guide',
                    'Password Manager Recommendations',
                    'MFA Best Practices',
                ],
            },
            insider_threat: {
                playbook: 'Insider Threat Incident Response Playbook',
                immediateActions: [
                    '🚨 Preserve evidence',
                    '🔐 Disable user account',
                    '📸 Capture system state',
                    '⚖️ Consult legal/HR',
                    '📢 Alert management',
                ],
                investigationSteps: [
                    '🔍 Review user activity logs',
                    '📊 Identify data accessed/exfiltrated',
                    '🌐 Check for unauthorized access',
                    '💾 Identify motive and timeline',
                    '👥 Check for accomplices',
                ],
                containmentSteps: [
                    '🛑 Revoke all access',
                    '🔐 Reset credentials',
                    '⚠️ Audit user permissions',
                    '🔒 Implement monitoring',
                ],
                recoverySteps: [
                    '✅ Secure affected systems',
                    '📋 Conduct forensic analysis',
                    '🔐 Implement preventive controls',
                    '📊 Review access policies',
                ],
                communicationTemplate: `
Subject: Internal Security Investigation

An internal security investigation is underway.
Affected systems have been secured.
Employees should report any suspicious activity.

For questions, contact security@company.com
        `,
                resources: [
                    'NIST Insider Threat Guide',
                    'CISA Insider Threat Mitigation',
                    'Behavioral Analysis Framework',
                ],
            },
            supply_chain: {
                playbook: 'Supply Chain Attack Incident Response Playbook',
                immediateActions: [
                    '🚨 Identify affected vendor/component',
                    '📸 Preserve evidence',
                    '🔐 Isolate affected systems',
                    '📢 Alert incident response team',
                    '⚖️ Consult legal',
                ],
                investigationSteps: [
                    '🔍 Identify compromised component',
                    '📊 Determine blast radius',
                    '🌐 Check for malicious code',
                    '💾 Identify attack vector',
                    '👥 Notify vendor',
                ],
                containmentSteps: [
                    '🛑 Isolate affected systems',
                    '🔐 Implement compensating controls',
                    '⚠️ Scan for indicators',
                    '🔒 Update security policies',
                ],
                recoverySteps: [
                    '✅ Patch or replace component',
                    '📋 Verify remediation',
                    '🔐 Implement vendor vetting',
                    '📊 Review supply chain security',
                ],
                communicationTemplate: `
Subject: Supply Chain Security Alert

A security vulnerability was discovered in a vendor component.
Affected systems: [list]
Actions taken: [list]
Vendor status: [status]

We are working with the vendor on remediation.
        `,
                resources: [
                    'NIST Supply Chain Risk Management',
                    'CISA Software Supply Chain Security',
                    'Vendor Security Assessment Framework',
                ],
            },
        };
        return playbookDb[incidentType] || playbookDb.phishing;
    }
}
__decorate([
    Widget({ route: 'threat-dashboard' }),
    Tool({
        name: 'get_incident_guidance',
        description: 'Get guided triage steps and playbook suggestions for a security incident',
        inputSchema: z.object({
            incidentType: z.enum([
                'phishing',
                'malware',
                'data_breach',
                'ransomware',
                'ddos',
                'account_compromise',
                'insider_threat',
                'supply_chain',
            ]),
            severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
            affectedSystems: z.array(z.string()).optional().describe('List of affected systems/users'),
        }),
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], IncidentAdvisorTools.prototype, "getIncidentGuidance", null);
//# sourceMappingURL=incidentadvisor.tools.js.map