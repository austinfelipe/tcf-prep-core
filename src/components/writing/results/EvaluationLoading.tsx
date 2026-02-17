'use client';

export function EvaluationLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900">
          Évaluation en cours...
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Analyse de vos productions écrites par IA. Cela peut prendre quelques secondes.
        </p>
      </div>
    </div>
  );
}
