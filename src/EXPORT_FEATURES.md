# Export Features - FinaryApp

## Overview
FinaryApp now includes comprehensive export capabilities for your monthly financial reports:
- **Download as PDF**: Generate and download beautifully formatted PDF reports
- **Save to Google Drive**: Automatically upload reports to your Google Drive

## Features

### 📄 PDF Export
- Professional landscape-oriented PDF layout
- Complete accounting ledger with all transactions
- Opening balance, running balance, and totals
- Formatted in Rupiah currency
- Includes account name and generation date
- Color-coded income (green) and expenses (red)
- Automatic file naming: `FinaryApp-Report-{MonthName}.pdf`

### ☁️ Google Drive Upload
- One-click upload to your Google Drive
- Requires Google authentication (OAuth)
- Files saved directly to your Drive root folder
- Same professional PDF format as download
- Automatic file naming for easy organization

## How to Use

### Download PDF Report
1. Navigate to the **Reports** tab
2. Select a month from the monthly archive
3. Click the **"Unduh PDF"** (Download PDF) button at the bottom of the report
4. The PDF will be automatically downloaded to your device

### Save to Google Drive
1. **Important**: Make sure you've logged in using **"Sign in with Google"**
2. Navigate to the **Reports** tab
3. Select a month from the monthly archive
4. Click the **"Simpan ke Drive"** (Save to Drive) button
5. The PDF will be automatically uploaded to your Google Drive

## Requirements

### For PDF Download
- No special requirements
- Works with any login method (email/password or Google)

### For Google Drive Upload
- **Must be logged in with Google OAuth**
- If you logged in with email/password, this feature will show an error message
- Google Drive API access is automatically configured through your Supabase Google OAuth

## Technical Details

### Libraries Used
- `jspdf` - PDF generation
- `jspdf-autotable` - Table formatting in PDF
- Google Drive API v3 - File upload to Drive

### Security
- Google access tokens are securely managed through Supabase
- Only users authenticated with Google can upload to Drive
- All exports use the same data visible in your reports

### File Format
- Format: PDF (application/pdf)
- Orientation: Landscape (A4)
- Encoding: UTF-8
- Tables: Striped theme with color-coded transactions

## Troubleshooting

### "Please log in with Google first to use this feature"
This means you're logged in with email/password instead of Google. To use Google Drive upload:
1. Log out from your current account
2. Click "Sign in with Google" on the login page
3. If you have an existing account with the same email, it will be automatically linked

### PDF download not working
- Check your browser's download settings
- Ensure pop-ups are not blocked
- Try a different browser

### Google Drive upload fails
1. Ensure you completed the Google OAuth setup in Supabase Dashboard (see `/GOOGLE_AUTH_SETUP.md`)
2. Check your internet connection
3. Verify you have sufficient storage in Google Drive
4. Try logging out and logging in again with Google

## Future Enhancements
Potential features for future versions:
- Custom folder selection in Google Drive
- Export multiple months at once
- Excel/CSV export format
- Email reports directly
- Scheduled automatic backups to Drive

## Notes
- Export buttons appear only when viewing a monthly report (not in the archive view)
- Reports include all transactions for the selected month
- Running balance calculation includes all previous transactions
- Generated PDFs are optimized for printing (A4 landscape)
