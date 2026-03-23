# Security Policy

## Supported Versions

| Version | Supported          | Security Updates |
|---------|--------------------|------------------|
| 1.x.x   | :white_check_mark: | :white_check_mark: |
| 0.x.x   | :x:                | :x:              |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, use one of these methods:

### Option 1: GitHub Security Advisory (Preferred)

Report vulnerabilities through [GitHub Security Advisories](https://github.com/acailic/vizualni-admin/security/advisories).

### Option 2: Private GitHub Issue

Create a [private security report](https://github.com/acailic/vizualni-admin/security/advisories/new).

### What to Include

- Vulnerability type and severity
- Steps to reproduce
- Potential impact assessment
- Any mitigation suggestions

## Response Timeline

We aim to respond to security reports as quickly as possible:

- **Initial Response**: Within 72 hours
- **Assessment**: Within 7 business days
- **Fix Timeline**: Depends on severity and complexity
- **Public Disclosure**: After fix is deployed and released

## Security Measures

This project implements security best practices:

### Code Security

- **TypeScript**: Type safety reduces runtime errors
- **Input Validation**: All user inputs are validated
- **Parameterized Queries**: SQL injection prevention
- **Authentication**: Secure auth with NextAuth.js

### Dependencies

- **Dependabot**: Automated dependency updates for security patches
- **GitHub Security Advisories**: Automated vulnerability alerts
- **Regular Audits**: Periodic review of dependencies

### Security Headers

The application configures security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Best Practices

### For Users

1. Keep the application updated to the latest version
2. Report suspicious behavior promptly
3. Use strong authentication credentials

### For Developers

1. Never commit secrets or credentials to the repository
2. Follow secure coding practices
3. Review dependencies before adding them
4. Run security audits regularly: `npm audit`

## Security Tools Used

These tools are configured for this project:

- **GitHub Dependabot**: Dependency vulnerability scanning
- **GitHub CodeQL**: Static code analysis (when enabled)
- **npm audit**: Dependency security audit

## Acknowledgments

We appreciate responsible disclosure of security vulnerabilities. Contributors who report valid security issues will be acknowledged in release notes (if desired).

---

If you discover a security issue, please report it responsibly through the channels above. Thank you for helping keep this project secure.
