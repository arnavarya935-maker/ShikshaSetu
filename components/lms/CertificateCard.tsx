'use client';

import { Award, Download, Printer } from 'lucide-react';
import { formatDate } from '../../lib/lms/utils';
import type { Certificate } from '../../lib/lms/types';
import { useLanguage } from '../../lib/language/LanguageContext';

type CertificateCardProps = {
  certificate: Certificate;
};

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a high-resolution canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2.0x scale for high DPI crispness (2400x1600px)
    const width = 2400;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    // --- 1. Background gradient ---
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#020617');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // --- 2. Elegant double borders ---
    // Outer border (Violet)
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Inner border (Fuchsia/Violet gradient)
    const borderGrad = ctx.createLinearGradient(0, 0, width, 0);
    borderGrad.addColorStop(0, '#8b5cf6');
    borderGrad.addColorStop(0.5, '#d946ef');
    borderGrad.addColorStop(1, '#f43f5e');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 4;
    ctx.strokeRect(65, 65, width - 130, height - 130);

    // Decorative corner overlays
    ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
    ctx.beginPath();
    ctx.arc(0, 0, 300, 0, Math.PI / 2);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width, height, 300, Math.PI, (Math.PI * 3) / 2);
    ctx.lineTo(width, height);
    ctx.fill();

    // --- 3. Badge details ---
    // Outer circle
    ctx.strokeStyle = 'rgba(217, 70, 239, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(width / 2, 260, 90, 0, Math.PI * 2);
    ctx.stroke();

    // Inner circle filled
    const badgeGrad = ctx.createRadialGradient(width / 2, 260, 10, width / 2, 260, 90);
    badgeGrad.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
    badgeGrad.addColorStop(1, 'rgba(217, 70, 239, 0.1)');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.arc(width / 2, 260, 85, 0, Math.PI * 2);
    ctx.fill();

    // Award emblem drawing
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 25, 235);
    ctx.lineTo(width / 2 + 25, 235);
    ctx.lineTo(width / 2 + 35, 275);
    ctx.lineTo(width / 2, 300);
    ctx.lineTo(width / 2 - 35, 275);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#e879f9';
    ctx.beginPath();
    ctx.arc(width / 2, 255, 30, 0, Math.PI * 2);
    ctx.fill();

    // Ribbon tails
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 25, 280);
    ctx.lineTo(width / 2 - 40, 340);
    ctx.lineTo(width / 2 - 15, 325);
    ctx.lineTo(width / 2, 290);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(width / 2 + 25, 280);
    ctx.lineTo(width / 2 + 40, 340);
    ctx.lineTo(width / 2 + 15, 325);
    ctx.lineTo(width / 2, 290);
    ctx.closePath();
    ctx.fill();

    // --- 4. Main Titles ---
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Subtitle label
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.fillText(t('cert_title').toUpperCase(), width / 2, 420);

    // Brand Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 84px system-ui, -apple-system, sans-serif';
    ctx.fillText(t('brand_name'), width / 2, 530);

    // Decorative divider lines
    const lineGrad = ctx.createLinearGradient(width / 2 - 200, 0, width / 2 + 200, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.6)');
    lineGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = lineGrad;
    ctx.fillRect(width / 2 - 300, 620, 600, 3);

    // Certification Statement
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'italic 36px Georgia, serif';
    ctx.fillText(t('cert_certified_that'), width / 2, 690);

    // Student Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 96px system-ui, -apple-system, sans-serif';
    ctx.fillText(certificate.userName, width / 2, 820);

    // Certification Content Text
    ctx.fillStyle = '#94a3b8';
    ctx.font = '36px Georgia, serif';
    ctx.fillText(t('cert_completed_course'), width / 2, 940);

    // Course Name
    ctx.fillStyle = '#e879f9';
    ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
    ctx.fillText(certificate.courseName, width / 2, 1050);

    // --- 5. Date & Certificate Details ---
    // Left column: Date
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(t('cert_date').toUpperCase(), 400, 1250);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'medium 36px system-ui, sans-serif';
    ctx.fillText(formatDate(certificate.earnedAt), 400, 1310);

    // Right column: Cert Number
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(t('cert_number').toUpperCase(), width - 850, 1250);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '36px monospace';
    ctx.fillText(certificate.certificateNumber, width - 850, 1310);

    // Signature Placeholder
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 150, 1290);
    ctx.lineTo(width / 2 + 150, 1290);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText('AUTHORIZED SIGNATURE', width / 2, 1330);

    // Convert canvas to downloadable blob
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shikshasetu-certificate-${certificate.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Certificate card UI representation */}
      <div
        className="relative overflow-hidden rounded-[2rem] border-2 border-violet-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-10 shadow-[0_32px_100px_rgba(139,92,246,0.15)] print:shadow-none"
        id="certificate-print"
      >
        {/* Decorative corners */}
        <div className="absolute left-0 top-0 h-32 w-32 rounded-br-full bg-gradient-to-br from-violet-500/10 to-transparent" />
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-tl-full bg-gradient-to-tl from-fuchsia-500/10 to-transparent" />

        <div className="relative text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 ring-2 ring-violet-500/30">
            <Award className="h-10 w-10 text-violet-300" />
          </div>

          {/* Title */}
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-400">
            {t('cert_title')}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            {t('brand_name')}
          </h2>

          {/* Divider */}
          <div className="mx-auto my-6 h-px w-48 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {/* Recipient */}
          <p className="text-sm text-slate-400">{t('cert_certified_that')}</p>
          <p className="mt-2 text-2xl font-bold text-white">{certificate.userName}</p>

          <p className="mt-4 text-sm text-slate-400">{t('cert_completed_course')}</p>
          <p className="mt-2 text-xl font-semibold text-violet-200">{certificate.courseName}</p>

          {/* Date & Number */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('cert_date')}</p>
              <p className="mt-1 font-medium text-slate-300">{formatDate(certificate.earnedAt)}</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('cert_number')}</p>
              <p className="mt-1 font-mono text-sm font-medium text-slate-300">{certificate.certificateNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-violet-400 hover:text-white"
        >
          <Printer className="h-4 w-4" />
          {t('cert_btn_print')}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400"
        >
          <Download className="h-4 w-4" />
          {t('cert_btn_download')}
        </button>
      </div>
    </div>
  );
}
