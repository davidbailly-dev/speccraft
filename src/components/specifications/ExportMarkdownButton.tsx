'use client';

import { Download } from 'lucide-react';
import { buildExportFileName, buildSpecificationMarkdown } from '@/lib/markdown/exportSpecification';
import type { SpecificationDetail } from '@/lib/mock-data/schemas';

export function ExportMarkdownButton({ specification }: { specification: SpecificationDetail }) {
    function handleExport() {
        const markdown = buildSpecificationMarkdown(specification);
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = buildExportFileName(specification);
        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
        >
            <Download size={16} />
            Exporter en Markdown
        </button>
    );
}
