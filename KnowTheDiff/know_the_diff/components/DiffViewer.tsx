import { LineDiffOp } from '@/utils/line_diff';

type DiffViewerProps = {
  diffOps: LineDiffOp[];
};

export default function DiffViewer({ diffOps }: DiffViewerProps) {
  return (
    <div className="font-mono text-sm border rounded overflow-auto">
      {diffOps.map((op, idx) => (
        <div
          key={`${op.type}-${op.lineNumber}-${idx}`}
          className={`flex ${op.type === 'add' ? 'bg-green-50' :
              op.type === 'remove' ? 'bg-red-50' :
                'bg-white'
            }`}
        >
          {/* Line number */}
          <span className="px-4 py-1 text-gray-500 select-none w-16 text-right border-r">
            {op.oldLineNumber || ''}
          </span>
          <span className="px-4 py-1 text-gray-500 select-none w-16 text-right border-r">
            {op.newLineNumber || ''}
          </span>

          {/* Diff indicator */}
          <span className="px-2 py-1 w-8">
            {op.type === 'add' ? '+' : op.type === 'remove' ? '-' : ' '}
          </span>

          {/* Content */}
          <span className={`px-2 py-1 flex-1 ${op.type === 'add' ? 'text-green-700' :
              op.type === 'remove' ? 'text-red-700' :
                'text-gray-900'
            }`}>
            {op.content}
          </span>
        </div>
      ))}
    </div>
  );
}
